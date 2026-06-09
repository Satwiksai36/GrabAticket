import React from 'react';

interface StadiumSection {
    name: string;
    seats: number;
    price: number;
}

export default function StadiumLayout({ sections }: { sections: StadiumSection[] }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            {sections.map(section => (
                <div
                    key={section.name}
                    className="p-6 border rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group hover:border-primary/50 hover:shadow-md"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{section.name}</h3>
                        <span className="bg-white border px-2 py-1 rounded text-xs font-semibold text-slate-500">
                            {section.price > 1000 ? 'Premium' : 'Standard'}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-slate-500">{section.seats.toLocaleString()} seats available</p>
                        <p className="text-xl font-bold text-primary">₹{section.price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
