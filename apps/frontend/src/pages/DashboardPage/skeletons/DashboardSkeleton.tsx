import Skeleton from 'react-loading-skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Main widget */}
      <div className="rounded-3xl p-8 bg-slate-900/40 border border-slate-800">
        <div className="flex justify-between items-center">
          <div className="space-y-4 w-2/3">
            <Skeleton height={16} width={180} />
            <Skeleton height={40} width={320} />
            <Skeleton height={20} width={260} />
          </div>
          <div className="space-y-3 text-right w-1/3">
            <Skeleton height={16} width={150} />
            <Skeleton height={28} width={140} />
            <Skeleton height={24} width={120} />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton height={200} borderRadius={24} />
        <Skeleton height={200} borderRadius={24} />
      </div>

      {/* Graph */}
      <div className="rounded-3xl p-6 bg-slate-900/40 border border-slate-800">
        <Skeleton height={300} />
      </div>

      {/* Cities */}
      <div className="rounded-3xl p-6 bg-slate-900/40 border border-slate-800">
        <Skeleton height={220} />
      </div>
    </div>
  )
}
