import React from 'react';
export function OverviewPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Overview</h1>
          <p className="text-muted-foreground">
            Organization overview coming soon.
          </p>
        </div>
      </div>
      <div className="border rounded-lg bg-card p-8 text-center text-muted-foreground">
        Overview dashboard will be displayed here.
      </div>
    </div>);

}