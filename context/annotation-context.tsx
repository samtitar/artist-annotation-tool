import React, { createContext, use, useContext, useEffect, useState } from "react";

export const AllSingleValues = [
    "name",
    "dateOfBirth",
    "dateOfDeath",
    "floruitStart",
    "floruitEnd",
] as const;

export const AllMultiValues = [
    "gender",
    "country",
    "occupation",
    "instanceOf",
] as const;

export type SingleValue = typeof AllSingleValues[number];
export type MultiValue = typeof AllMultiValues[number];

type Source = {
    color: number;
    label: string;
    url: string;
    snippet: string;
    deleted: boolean;
    singleValues: { [key in SingleValue]?: string };
    multiValues: { [key in MultiValue]?: string[] };
};

const initialSources: Source[] = [
    {
        color: 0,
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Selina_Khan",
        snippet:
            "Selina Khan is a renowned software engineer known for her contributions to open source projects...",
        deleted: false,
        singleValues: {
            name: "Selina Khan",
            dateOfBirth: "04/30/2000",
            dateOfDeath: undefined,
            floruitStart: undefined,
            floruitEnd: undefined,
        },
        multiValues: {
            gender: ["Female"],
            country: ["Netherlands"],
            occupation: [],
            instanceOf: ["Human"],
        },
    },
    {
        color: 1,
        label: "Official Website",
        url: "https://www.selinakhan.com",
        snippet:
            "Welcome to the official website of Selina Khan, where you can find her portfolio and contact information...",
        deleted: false,
        singleValues: {
            name: "Selina Khan",
            dateOfBirth: "04/30/2000",
            dateOfDeath: undefined,
            floruitStart: "2018",
            floruitEnd: undefined,
        },
        multiValues: {
            instanceOf: ["Bby", "Human"],
        },
    },
    {
        color: 2,
        label: "GitHub",
        url: "https://github.com/selinakh",
        snippet: "Check out Selina Khan's GitHub profile for her latest projects and contributions...",
        deleted: false,
        singleValues: {
            name: "Selina Khan",
            dateOfBirth: undefined,
            dateOfDeath: undefined,
            floruitStart: undefined,
            floruitEnd: undefined,
        },
        multiValues: {
            occupation: ["Software Engineer"],
        },
    },
];

export const initialSingleValueSourceMap: { [key in SingleValue]: string } = {
    name: "https://en.wikipedia.org/wiki/Selina_Khan",
    dateOfBirth: "https://www.selinakhan.com",
    dateOfDeath: "https://www.selinakhan.com",
    floruitStart: "https://www.selinakhan.com",
    floruitEnd: "https://www.selinakhan.com",
}

export const initialMultiValueSourceMap: { [key in MultiValue]: { [key: string]: number }[] } = {
    gender: [{ "https://en.wikipedia.org/wiki/Selina_Khan": 0 }],
    country: [{ "https://en.wikipedia.org/wiki/Selina_Khan": 0 }],
    occupation: [{ "https://github.com/selinakh": 0 }],
    instanceOf: [{ "https://en.wikipedia.org/wiki/Selina_Khan": 0 }, { "https://www.selinakhan.com": 1 }],
}

export const initialValueSourceRankMap: { [key in SingleValue | MultiValue]: string[] } = {
    name: ["https://en.wikipedia.org/wiki/Selina_Khan", "https://www.selinakhan.com", "https://github.com/selinakh"],
    gender: ["https://en.wikipedia.org/wiki/Selina_Khan", "https://www.selinakhan.com", "https://github.com/selinakh"],
    dateOfBirth: ["https://www.selinakhan.com", "https://en.wikipedia.org/wiki/Selina_Khan", "https://github.com/selinakh"],
    dateOfDeath: ["https://www.selinakhan.com", "https://en.wikipedia.org/wiki/Selina_Khan", "https://github.com/selinakh"],
    floruitStart: ["https://www.selinakhan.com", "https://en.wikipedia.org/wiki/Selina_Khan", "https://github.com/selinakh"],
    floruitEnd: ["https://www.selinakhan.com", "https://en.wikipedia.org/wiki/Selina_Khan", "https://github.com/selinakh"],
    country: ["https://en.wikipedia.org/wiki/Selina_Khan", "https://www.selinakhan.com", "https://github.com/selinakh"],
    occupation: ["https://en.wikipedia.org/wiki/Selina_Khan", "https://www.selinakhan.com", "https://github.com/selinakh"],
    instanceOf: ["https://en.wikipedia.org/wiki/Selina_Khan", "https://www.selinakhan.com", "https://github.com/selinakh"],
}

type AnnotationContextShape = {
    editingKey: SingleValue | MultiValue | null;
    sources: Source[];
    singleValues: { [key in SingleValue]?: [string, number] };
    multiValues: { [key in MultiValue]?: [string[], number[]] };
    activeSourceValues: { [key: string]: Set<string> };
    setEditingKey: (v: SingleValue | MultiValue | null) => void;
    setSingleValue: (key: SingleValue, sourceURL: string) => void;
    addMultiValue: (key: MultiValue, sourceURL: string, index: number) => void;
    deleteMultiValue: (key: MultiValue, index: number) => void;
    addManualSingleValue: (key: SingleValue, value: string) => void;
    addManualMultiValue: (key: MultiValue, value: string) => void;
};

const AnnotationContext = createContext<AnnotationContextShape | undefined>(undefined);

export function AnnotationProvider({ children }: { children: React.ReactNode }) {
    const [editingKey, setEditingKey] = useState<SingleValue | MultiValue | null>(null);

    const [sources, setSources] = useState<Source[]>(initialSources);
    const [sourceRankMap, setSourceRankMap] = useState<{ [key in SingleValue | MultiValue]: string[] }>(initialValueSourceRankMap);

    // Mapping of source URL to set of singleValue/multiValue
    const [activeSourceValues, setActiveSourceValues] = useState<{ [key: string]: Set<string> }>({});
    const [singleValueSourceMap, setSingleValueSourceMap] = useState<{ [key in SingleValue]: string }>(initialSingleValueSourceMap);
    const [multiValueSourceMap, setMultiValueSourceMap] = useState<{ [key in MultiValue]: { [key: string]: number }[] }>(initialMultiValueSourceMap);

    const [singleValues, setSingleValues] = useState<{ [key in SingleValue]?: [string, number] }>({});
    const [multiValues, setMultiValues] = useState<{ [key in MultiValue]?: [string[], number[]] }>({});

    useEffect(() => {
        const newSingleValues: { [key in SingleValue]?: [string, number] } = {};

        // Build singleValues from singleValueSourceMap
        for (const key of AllSingleValues) {
            const sourceURL = singleValueSourceMap[key];
            const sourceObj = sources.find((s) => s.url === sourceURL);
            const value = sourceObj?.singleValues[key];
            if (value) {
                newSingleValues[key] = [value, sourceObj?.color || 0];
            }
        }

        setSingleValues(newSingleValues);
    }, [singleValueSourceMap, sources]);

    useEffect(() => {
        const newMultiValues: { [key in MultiValue]?: [string[], number[]] } = {};
        // Build multiValues from multiValueSourceMap
        for (const key of AllMultiValues) {
            const entries = multiValueSourceMap[key];
            const values: string[] = [];
            const indexes: number[] = [];

            entries.forEach((entry) => {
                for (const sourceURL in entry) {
                    const sourceObj = sources.find((s) => s.url === sourceURL);
                    const sourceValues = sourceObj?.multiValues[key];
                    const index = entry[sourceURL];

                    if (sourceValues && sourceValues[index]) {
                        values.push(sourceValues[index]);
                        indexes.push(sourceObj?.color || 0);
                    }
                }
            });

            if (values.length > 0) {
                newMultiValues[key] = [values, indexes];
            } else {
                newMultiValues[key] = [[], []];
            }
        }

        setMultiValues(newMultiValues);
    }, [singleValueSourceMap, multiValueSourceMap, sources]);


    useEffect(() => {
        // Recalculate activeSourceValues (mapping of source ID to set of active single/multi values)
        const newActiveSourceValues: { [key: string]: Set<string> } = {};

        if (AllSingleValues.includes(editingKey as SingleValue)) {
            const key = editingKey as SingleValue;

            sources.forEach((source) => {
                const value = source.singleValues[key];
                if (value) {
                    if (!newActiveSourceValues[source.url]) {
                        newActiveSourceValues[source.url] = new Set();
                    }
                    newActiveSourceValues[source.url].add(value);
                }
            });
        } else if (AllMultiValues.includes(editingKey as MultiValue)) {
            const key = editingKey as MultiValue;

            sources.forEach((source) => {
                const values = source.multiValues[key];
                if (values && values.length > 0) {
                    if (!newActiveSourceValues[source.url]) {
                        newActiveSourceValues[source.url] = new Set();
                    }

                    values.forEach((value) => {
                        // Check if value is already added to editingKey
                        if (multiValueSourceMap[key]?.some((entry) => {
                            return Object.entries(entry).some(([url, index]) => {
                                return url === source.url && source.multiValues[key]?.[index] === value;
                            });
                        })) {
                            return; // Skip adding this value as it's already active
                        }

                        newActiveSourceValues[source.url].add(value);
                    });
                }
            });
        }

        setActiveSourceValues(newActiveSourceValues);
    }, [editingKey, sources]);

    useEffect(() => {
        // Re-order sources based on editingKey and sourceRankMap
        if (editingKey) {
            const rankedSourceURLs = sourceRankMap[editingKey];

            const newSources = [...sources].sort((a, b) => {
                const rankA = rankedSourceURLs.indexOf(a.url);
                const rankB = rankedSourceURLs.indexOf(b.url);
                return rankA - rankB;
            });

            setSources(newSources);
        }
    }, [editingKey, sourceRankMap, sources]);

    const setSingleValue = (key: SingleValue, sourceURL: string) => {
        setSingleValueSourceMap((prev) => ({
            ...prev,
            [key]: sourceURL
        }));
    }

    const addMultiValue = (key: MultiValue, sourceURL: string, index: number) => {
        setMultiValueSourceMap((prev) => {
            const existingEntries = prev[key] || [];
            return {
                ...prev,
                [key]: [
                    ...existingEntries,
                    { [sourceURL]: index }
                ],
            };
        });
    }

    const deleteMultiValue = (key: MultiValue, index: number) => {
        setMultiValueSourceMap((prev) => {
            const existingEntries = prev[key] || [];
            return {
                ...prev,
                [key]: existingEntries.filter((_, i) => i !== index),
            };
        });
    }

    const addManualSingleValue = (key: SingleValue, value: string) => {
        setSources((prev) => {
            const manualSourceIndex = prev.findIndex((s) => s.url === `manual:${key}`);
            if (manualSourceIndex !== -1) {
                // Update existing manual source
                const updatedSources = [...prev];
                updatedSources[manualSourceIndex].singleValues[key] = value;
                return updatedSources;
            } else {
                // Add new manual source
                return [
                    ...prev,
                    {
                        color: 0,
                        label: "Manual Entry",
                        url: `manual:${key}`,
                        snippet: "User provided manual value.",
                        deleted: false,
                        singleValues: {
                            [key]: value,
                        },
                        multiValues: {},
                    },
                ];
            }
        });

        setSingleValueSourceMap((prev) => ({
            ...prev,
            [key]: `manual:${key}`,
        }));
    }

    const addManualMultiValue = (key: MultiValue, value: string) => {
        setSources((prev) => {
            const manualSourceIndex = prev.findIndex((s) => s.url === `manual:${key}`);
            if (manualSourceIndex !== -1) {
                // Update existing manual source
                const updatedSources = [...prev];
                const existingValues = updatedSources[manualSourceIndex].multiValues[key] || [];
                updatedSources[manualSourceIndex].multiValues[key] = [...existingValues, value];
                return updatedSources;
            } else {
                // Add new manual source
                return [
                    ...prev,
                    {
                        color: 0,
                        label: "Manual Entry",
                        url: `manual:${key}`,
                        snippet: "User provided manual value.",
                        deleted: false,
                        singleValues: {},
                        multiValues: {
                            [key]: [value],
                        },
                    },
                ];
            }
        });

        setMultiValueSourceMap((prev) => {
            const existingEntries = prev[key] || [];
            return {
                ...prev,
                [key]: [
                    ...existingEntries,
                    { [`manual:${key}`]: (existingEntries.find(entry => entry[`manual:${key}`] !== undefined)?.[`manual:${key}`] || 0) },
                ],
            };
        });
    }

    const value: AnnotationContextShape = {
        editingKey,
        sources,
        singleValues,
        multiValues,
        activeSourceValues,
        setEditingKey,
        setSingleValue,
        addMultiValue,
        deleteMultiValue,
        addManualSingleValue,
        addManualMultiValue,
    };

    return <AnnotationContext.Provider value={value}>{children}</AnnotationContext.Provider>;
}

export function useAnnotationContext() {
    const ctx = useContext(AnnotationContext);
    if (!ctx) throw new Error("useAnnotationContext must be used within an AnnotationProvider");
    return ctx;
}

export default AnnotationProvider;
