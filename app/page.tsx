'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn, H1, H2, H3, H4, H5 } from "@/components/ui/typography";
import { Check, MoveLeft, MoveRight, MoveRightIcon, Save, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Values = 'name'
  | 'gender'
  | 'dateOfBirth'
  | 'dateOfDeath'
  | 'country'
  | 'occupation'
  | 'instanceOf'
  | 'floruitStart'
  | 'floruitEnd';

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

const initialSources = [
  {
    id: 0,
    color: 0,
    label: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Selina_Khan",
    snippet: "Selina Khan is a renowned software engineer known for her contributions to open source projects...",
    deleted: false,
  },
  {
    id: 1,
    color: 1,
    label: "Official Website",
    url: "https://www.selinakhan.com",
    snippet: "Welcome to the official website of Selina Khan, where you can find her portfolio and contact information...",
    deleted: false,
  },
  {
    id: 2,
    color: 2,
    label: "GitHub",
    url: "https://github.com/selinakh",
    snippet: "Check out Selina Khan's GitHub profile for her latest projects and contributions...",
    deleted: false,
  }
];

const initialSourceValues = [
  {
    sourceId: 0,
    values: {
      name: "Selina Khan",
      gender: ["Female"],
      dateOfBirth: "04/30/2000",
      dateOfDeath: undefined,
      country: ["Netherlands"],
      occupation: [],
      instanceOf: ["Human"],
      floruitStart: "2018",
      floruitEnd: undefined,
    },
  },
  {
    sourceId: 1,
    values: {
      name: "Selina Khan",
      gender: ["Female"],
      dateOfBirth: "04/30/2000",
      dateOfDeath: undefined,
      country: ["Netherlands"],
      occupation: ["Software Engineer"],
      instanceOf: ["Human", "Bby"],
      floruitStart: "2018",
      floruitEnd: undefined,
    },
  },
  {
    sourceId: 2,
    values: {
      name: "Selina Khan",
      gender: ["Female"],
      dateOfBirth: undefined,
      dateOfDeath: undefined,
      country: [],
      occupation: ["Software Engineer"],
      instanceOf: [],
      floruitStart: undefined,
      floruitEnd: undefined,
    },
  },
];

// Either a number (single source) or array of [number, number] (multiple sources, multiple values)
const initialValueSourceMap: { [key: string]: number | [number, number][] } = {
  name: 0,
  gender: [[0, 0]],
  dateOfBirth: 1,
  dateOfDeath: 1,
  country: [[0, 0]],
  occupation: [[2, 0]],
  instanceOf: [[0, 0], [1, 1]],
  floruitStart: 1,
  floruitEnd: 1,
};

const initialValueSourceRankMap: { [key: string]: number[] } = {
  name: [0, 1, 2],
  gender: [0, 1, 2],
  dateOfBirth: [1, 0, 2],
  dateOfDeath: [1, 0, 2],
  country: [0, 1, 2],
  occupation: [2, 0, 1],
  instanceOf: [0, 1, 2],
  floruitStart: [1, 0, 2],
  floruitEnd: [1, 0, 2],
};

function SingleValueDisplay({
  label,
  value,
  color,
  disabled,
  isEditing,
  setIsEditing,
  resetIsEditing
}: {
  label: string;
  value: string;
  color: number;
  disabled: boolean;
  isEditing: boolean;
  setIsEditing: () => void;
  resetIsEditing: () => void
}) {
  const borderColor = borderColorOptions[color];
  const bgColor = bgColorOptions[color];

  return (
    <div className="p-2 w-full rounded-md shadow-sm">
      <div className="w-full flex flex-row items-center justify-between">
        <H5>{label}</H5>

        <Button
          size="sm"
          className="text-blue-500"
          onClick={() => { !isEditing ? setIsEditing() : resetIsEditing(); }}
          disabled={disabled}
          variant="ghost"
        >
          {!isEditing ? "Edit" : "Save"}
        </Button>
      </div>

      <div className="w-full flex flex-row items-center gap-2 mt-1">
        <div
          className={cn(
            "flex group flex-row items-center gap-2 py-1.5 px-2 text-sm rounded-md mt-1 border",
            !disabled ? borderColor : "border-gray-200"
          )}
          tabIndex={0}
        >
          {value}
          <div className={cn(`w-4 h-4 rounded-sm inline-block`, disabled ? "bg-gray-200" : bgColor)}></div>
        </div>
      </div>
    </div>
  );
}

function MultiValueDisplay({
  label,
  values,
  colors,
  disabled,
  isEditing,
  setIsEditing,
  resetIsEditing,
  deleteEntry,
}: {
  label: string;
  values: string[];
  colors: number[];
  disabled: boolean;
  isEditing: boolean;
  setIsEditing: () => void;
  resetIsEditing: () => void;
  deleteEntry: (index: number) => void;
}) {
  return (
    <div className="p-2 w-full rounded-md shadow-sm">
      <div className="w-full flex flex-row items-center justify-between">
        <H5>{label}</H5>

        <Button
          size="sm"
          className="text-blue-500"
          onClick={() => { !isEditing ? setIsEditing() : resetIsEditing(); }}
          disabled={disabled}
          variant="ghost"
        >
          {!isEditing ? "Edit" : "Save"}
        </Button>
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
                  "flex group flex-row items-center gap-2 py-1.5 px-2 text-sm rounded-md mt-1 border",
                  !disabled ? borderColor : "border-gray-200",
                  isEditing ? "hover:cursor-pointer hover:border-red-400 hover:border-dashed" : ""
                )}
              onClick={() => { if (isEditing) { deleteEntry(index); } }}
            >
              {value}
              <div className={
                cn(
                  "w-4 h-4 rounded-sm inline-block",
                  disabled ? "bg-gray-200" : bgColor,
                  isEditing ? "group-hover:hidden" : ""
                )
              } />
              <div
                className={cn(
                  "w-4 h-4 hidden",
                  isEditing ? "group-hover:inline-block" : ""
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
  activeValues,
  onClick
}: {
  color: number;
  label: string;
  url: string;
  snippet: string;
  activeValues?: string[];
  onClick?: (index: number) => void;
}) {
  const borderColor = borderColorOptions[color];
  const bgColor = bgColorOptions[color];

  return (
    <div
      className={cn(`p-2 border rounded-md transition-all`, borderColor)}
    >
      <H4>
        <div className={cn(`w-4 h-4 rounded-sm inline-block mr-2`, bgColor)}></div>
        {label}
      </H4>
      <Link href={url} className="text-sm underline text-blue-500">{url}</Link>
      <p className="text-sm">{snippet}</p>

      {activeValues && activeValues.length > 0 && (
        <div className="mt-2 flex flex-row items-center gap-2">
          {activeValues.map((value, index) => (
            <Button
              key={index}
              className={cn("mt-2 border border-gray-200")}
              value={value}
              onMouseDown={() => onClick && onClick(index)}
            >
              {value}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [editingValue, setEditingValue] = useState<Values | null>(null);

  const [sources, setSources] = useState(initialSources);
  const [sourceValues, setSourceValues] = useState(initialSourceValues);
  const [valueSourceMap, setValueSourceMap] = useState(initialValueSourceMap);
  const [valueSourceRankMap, setValueSourceRankMap] = useState(initialValueSourceRankMap);

  const [values, setValues] = useState<{ [key in Values]?: string | string[] }>({});

  useEffect(() => {
    // Compute values based on valueSourceMap and sourceValues
    const newValues: { [key in Values]?: string | string[] } = {};

    (Object.keys(valueSourceMap) as Values[]).forEach((key) => {
      const sourceInfo = valueSourceMap[key];
      if (Array.isArray(sourceInfo)) {
        // Multi-value
        const indices = sourceInfo as [number, number][];
        const vals: string[] = [];
        indices.forEach(([sourceIndex, valueIndex]) => {
          const source = sources.find((source) => source.id === sourceIndex);
          const sourceValue = sourceValues.find((sv) => sv.sourceId === source!.id)?.values[key];
          if (sourceValue && Array.isArray(sourceValue)) {
            vals.push(sourceValue[valueIndex]);
          }
        });
        newValues[key] = vals;
      } else {
        // Single-value
        const source = sources.find((source) => source.id === sourceInfo);
        const sourceValue = sourceValues.find((sv) => sv.sourceId === source!.id)?.values[key];
        if (sourceValue && !Array.isArray(sourceValue)) {
          newValues[key] = sourceValue;
        }
      }
    });

    setValues(newValues);
  }, [valueSourceMap, sources, sourceValues]);

  return (
    <div className="flex flex-col h-screen">
      <main className="p-4 h-full overflow-y-auto">
        <div className="flex flex-row gap-2 h-full">

          {/* Artist Data */}
          <div className="flex flex-col gap-2 w-1/2 p-2">
            <H2>Artist Data</H2>
            {(Object.keys(valueSourceMap) as Values[]).map((key) => {
              if (Array.isArray(valueSourceMap[key])) {
                const indices = valueSourceMap[key] as [number, number][];
                const values = indices.map(([sourceIndex, valueIndex]) => {
                  const source = sources.find((source) => source.id === sourceIndex);
                  const sourceValue = sourceValues.find((sv) => sv.sourceId === source!.id)?.values[key as Values];
                  return sourceValue ? sourceValue[valueIndex] : "No value";
                });

                const colors = indices.map(([sourceIndex, _]) => {
                  const source = sources.find((source) => source.id === sourceIndex);
                  return source!.color;
                });

                return (
                  <MultiValueDisplay
                    key={key}
                    label={key}
                    values={values}
                    colors={colors}
                    disabled={editingValue !== null && editingValue !== key}
                    isEditing={editingValue === key}
                    setIsEditing={() => setEditingValue(key as Values)}
                    resetIsEditing={() => setEditingValue(null)}
                    deleteEntry={(index: number) => {
                      // Remove the entry at index
                      const newIndices = indices.filter((_, i) => i !== index);
                      const newValueSourceMap = { ...valueSourceMap };
                      newValueSourceMap[key] = newIndices;
                      setValueSourceMap(newValueSourceMap);
                    }}
                  />
                )
              } else {
                const source = sources.find((source) => source.id === valueSourceMap[key]);
                const sourceValue = sourceValues.find((sv) => sv.sourceId === source!.id)?.values[key as Values];

                return (
                  <SingleValueDisplay
                    key={key}
                    label={key}
                    value={sourceValue as string ?? "No value"}
                    color={source!.color}
                    disabled={editingValue !== null && editingValue !== key}
                    isEditing={editingValue === key}
                    setIsEditing={() => setEditingValue(key as Values)}
                    resetIsEditing={() => setEditingValue(null)}
                  />
                )
              }
            })}
          </div>

          <div className="flex flex-col gap-2 w-1/2 p-2">
            {/* Sources */}
            <H2>Sources</H2>
            <div className="overflow-y-auto flex flex-col gap-2 border-t border-b border-muted">
              {editingValue === null ? (
                sources.filter((source) => !source.deleted).map((source) => (
                  <SourceDisplay
                    key={source.id}
                    color={source.color}
                    label={source.label}
                    url={source.url}
                    snippet={source.snippet}
                  />
                ))
              ) : (
                // Sort by rank of source for the currently editing value
                sources
                  .filter((source) => !source.deleted)
                  .sort((a, b) => {
                    const rankA = valueSourceRankMap[editingValue!].indexOf(a.id);
                    const rankB = valueSourceRankMap[editingValue!].indexOf(b.id);
                    return rankA - rankB;
                  })
                  .map((source) => {
                    const activeValues: string[] = [];
                    const sourceValue = sourceValues.find((sv) => sv.sourceId === source.id)?.values[editingValue!];
                    if (sourceValue) {
                      if (Array.isArray(sourceValue)) {
                        activeValues.push(...sourceValue);
                      } else {
                        activeValues.push(sourceValue);
                      }
                    }

                    return (
                      <SourceDisplay
                        key={source.id}
                        color={source.color}
                        label={source.label}
                        url={source.url}
                        snippet={source.snippet}
                        activeValues={activeValues}
                        onClick={() => {
                          // Update the value to this source's value
                          // setValueSourceMap({ ...valueSourceMap, [editingValue!]: source.id });
                          const newValueSourceMap = { ...valueSourceMap };
                          if (Array.isArray(newValueSourceMap[editingValue!])) {
                            // Multi-value
                            const indices = (newValueSourceMap[editingValue!] as [number, number][]);
                            // Find if this source is already in the list
                            const existingIndex = indices.findIndex(([sourceIndex, _]) => sourceIndex === source.id);
                            if (existingIndex === -1) {
                              // Add new
                              indices.push([source.id, 0]);
                            } else {
                              // Already exists, do nothing for now
                            }
                            newValueSourceMap[editingValue!] = indices;
                          } else {
                            // Single-value
                            newValueSourceMap[editingValue!] = source.id;
                          }
                          setValueSourceMap(newValueSourceMap);
                        }}

                      />
                    )
                  })
              )}
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
