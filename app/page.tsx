"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, H1, H2, H3, H4, H5 } from "@/components/ui/typography";
import { Check, MoveLeft, MoveRight, Trash } from "lucide-react";
import Link from "next/link";
import AnnotationProvider, { AllSingleValues, MultiValue, SingleValue, useAnnotationContext } from "@/context/annotation-context";
import { Input } from "@/components/ui/input";

const borderColorOptions = [
    "border-red-400",
    "border-green-400",
    "border-blue-400",
    "border-orange-400",
    "border-yellow-400",
    "border-indigo-400",
    "border-purple-400",
    "border-pink-400",
];

const bgColorOptions = [
    "bg-red-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-indigo-400",
    "bg-purple-400",
    "bg-pink-400",
];

// initial data and state moved into the AnnotationProvider (see /context/annotation-context.tsx)

function SingleValueDisplay({
    valueKey,
    label,
    value,
    color,
}: {
    valueKey: SingleValue;
    label: string;
    value: string;
    color: number;
}) {
    const borderColor = borderColorOptions[color];
    const bgColor = bgColorOptions[color];

    const { editingKey, setEditingKey } = useAnnotationContext();
    const disabled = editingKey !== null && editingKey !== valueKey;
    const active = editingKey === valueKey;

    return (
        <div
            className={cn(
                "p-2 w-full rounded-md hover:cursor-pointer border",
                disabled ? "opacity-50" : "hover:shadow-md"
            )}
            onClick={() => {
                if (!disabled) {
                    setEditingKey(active ? null : valueKey);
                }
            }}
            tabIndex={0}
        >
            <div className="w-full flex flex-row items-center justify-between">
                <H5>{label}</H5>
            </div>

            <div className="w-full flex flex-row items-center gap-2 mt-1">
                <div
                    className={cn(
                        "flex group flex-row items-center gap-2 py-1.5 px-2 text-sm rounded-md mt-1 border",
                        !disabled ? borderColor : "border-gray-200"
                    )}
                >
                    {value}
                    <div className={cn(`w-4 h-4 rounded-sm inline-block`, disabled ? "bg-gray-200" : bgColor)}></div>
                </div>
            </div>
        </div>
    );
}

function MultiValueDisplay({
    valueKey,
    label,
    values,
    colors,
}: {
    valueKey: MultiValue;
    label: string;
    values: string[];
    colors: number[];
}) {
    const { editingKey, setEditingKey, deleteMultiValue } = useAnnotationContext();
    const disabled = editingKey !== null && editingKey !== valueKey;
    const active = editingKey === valueKey;

    return (
        <div
            className={cn(
                "p-2 w-full rounded-md hover:cursor-pointer border",
                disabled ? "opacity-50" : "hover:shadow-md"
            )}
            onClick={() => {
                if (!disabled) {
                    setEditingKey(active ? null : valueKey);
                }
            }}
            tabIndex={0}
        >
            <div className="w-full flex flex-row items-center justify-between">
                <H5>{label}</H5>
            </div>

            <div className="flex flex-row gap-2 mt-1">
                {values.length === 0 && (
                    <div className="mt-1 text-sm border-dashed border border-gray-300 rounded-md py-1.5 px-2 text-muted-foreground"
                    >
                        No values
                    </div>
                )}

                {values.map((value, index) => {
                    const borderColor = borderColorOptions[colors[index]];
                    const bgColor = bgColorOptions[colors[index]];

                    return (
                        <div key={index}
                            className={
                                cn(
                                    "bg-white flex group flex-row items-center gap-2 py-1.5 px-2 text-sm rounded-md mt-1 border",
                                    !disabled ? borderColor : "border-gray-200",
                                    active ? "hover:cursor-pointer hover:border-red-400 hover:border-dashed" : ""
                                )}
                            onMouseDown={() => {
                                if (active) {
                                    deleteMultiValue(valueKey, index);
                                }
                            }}
                        >
                            {value}
                            <div className={
                                cn(
                                    "w-4 h-4 rounded-sm inline-block",
                                    disabled ? "bg-gray-200" : bgColor,
                                    active ? "group-hover:hidden" : ""
                                )
                            } />
                            <div
                                className={cn(
                                    "w-4 h-4 hidden",
                                    active ? "group-hover:inline-block" : ""
                                )}
                            >
                                <Trash
                                    className="text-red-500 h-4 w-4"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SourceDisplay({
    color,
    label,
    url,
    snippet,
}: {
    color: number;
    label: string;
    url: string;
    snippet: string;
}) {
    const { editingKey, setSingleValue, addMultiValue, activeSourceValues } = useAnnotationContext();
    const borderColor = borderColorOptions[color];
    const bgColor = bgColorOptions[color];

    return (
        <div
            className={cn(`p-2 border rounded-md transition-all`, borderColor)}
            aria-label="Source Display Item"
        >
            <H4>
                <div className={cn(`w-4 h-4 rounded-sm inline-block mr-2`, bgColor)}></div>
                {label}
            </H4>
            <Link href={url} className="text-sm underline text-blue-500">{url}</Link>
            <p className="text-sm">{snippet}</p>

            {activeSourceValues[url] && Array.from(activeSourceValues[url]).length > 0 && (
                <div className="mt-2 flex flex-row items-center gap-2">
                    {Array.from(activeSourceValues[url]).map((value, index) => (
                        <Button
                            key={index}
                            className={cn("mt-2 border border-gray-200")}
                            onMouseDown={() => {
                                if (editingKey !== null) {
                                    if (AllSingleValues.includes(editingKey)) {
                                        setSingleValue(editingKey as SingleValue, url);
                                    } else {
                                        addMultiValue(editingKey as MultiValue, url, index);
                                    }
                                }
                            }}
                        >
                            {value}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

function ManualSourceDisplay() {
    const { editingKey, addManualSingleValue, addManualMultiValue } = useAnnotationContext();

    if (editingKey === null) {
        return null;
    }

    return (
        <div className="p-2 border rounded-md border-gray-300">
            <H4>Manual Values</H4>

            <div className="flex flex-col gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Adding manual value for: <strong>{editingKey}</strong></span>

                <div className="flex flex-row items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Enter value here"
                    />
                    <Button
                        onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            const value = input.value.trim();
                            if (value === "") return;

                            if (AllSingleValues.includes(editingKey)) {
                                addManualSingleValue(editingKey as SingleValue, value);
                            } else {
                                addManualMultiValue(editingKey as MultiValue, value);
                            }

                            input.value = "";
                        }}
                    >Add</Button>
                </div>
            </div>
        </div>
    );
}

function HomeContent() {
    const {
        sources,
        singleValues,
        multiValues,
    } = useAnnotationContext();

    return (
        <div className="flex flex-col h-screen">
            <main className="p-4 h-full overflow-y-auto">
                <div className="flex flex-row gap-2 h-full">

                    {/* Artist Data */}
                    <div className="flex flex-col gap-2 w-1/2 p-2">
                        <H2>Artist Data</H2>

                        {Object.keys(singleValues).map((key) => {
                            const value = singleValues[key as SingleValue];

                            if (!value) return null;

                            return <SingleValueDisplay
                                key={key}
                                valueKey={key as SingleValue}
                                label={key}
                                value={value[0]}
                                color={value[1]}
                            />
                        })}

                        {Object.keys(multiValues).map((key) => {
                            const value = multiValues[key as MultiValue];

                            if (!value) return null;

                            return <MultiValueDisplay
                                key={key}
                                valueKey={key as MultiValue}
                                label={key}
                                values={value[0]}
                                colors={value[1]}
                            />
                        })}
                    </div>

                    <div className="flex flex-col gap-2 w-1/2 p-2">
                        {/* Sources */}
                        <H2>Sources</H2>
                        <div className="overflow-y-auto flex flex-col gap-2 border-t border-b border-muted">
                            {sources.filter((source) => !source.url.startsWith("manual")).map((source) => (
                                <SourceDisplay
                                    key={source.url}
                                    color={source.color}
                                    label={source.label}
                                    url={source.url}
                                    snippet={source.snippet}
                                />
                            ))}
                        </div>

                        <div className="flex-grow">
                            <ManualSourceDisplay />
                        </div>

                    </div>
                </div>
            </main>

            <header className="p-4 border-t border-muted flex flex-row items-center justify-between gap-2">
                <Button variant="outline"><MoveLeft /> Previous</Button>
                <Progress value={50} />
                <span className="mono">50%</span>
                <Button variant="outline">Next <MoveRight /></Button>
                <Button>Mark Complete <Check /></Button>
            </header>
        </div>
    );
}

export default function Home() {
    return (
        <AnnotationProvider>
            <HomeContent />
        </AnnotationProvider>
    );
}
