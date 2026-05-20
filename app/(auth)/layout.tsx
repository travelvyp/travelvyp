export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TV</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">TravelVYP</span>
        </div>

        {/* Quote */}
        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl font-light leading-relaxed text-slate-200">
              "No construimos itinerarios.<br />
              Construimos experiencias que{" "}
              <span className="text-blue-400 font-medium">el pasajero recuerda para siempre</span>."
            </p>
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
              PT
            </div>
            <div>
              <p className="font-medium text-sm">Pablo Tocci</p>
              <p className="text-slate-400 text-xs">TravelVYP — Sistema operativo para agencias</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50">
          {[
            { value: "MVP", label: "En desarrollo" },
            { value: "100%", label: "Modular" },
            { value: "Premium", label: "Output visual" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
