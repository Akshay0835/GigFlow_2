import { Zap, Layout, Globe, ArrowRight, BarChart3, Users, Workflow } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Lightning Imports",
      desc: "Instantly parse and inject thousands of leads from CSV files directly into your CRM database without breaking a sweat.",
      bg: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      icon: <Layout className="w-8 h-8 text-blue-500" />,
      title: "Smart Dashboard",
      desc: "Visualize your entire sales pipeline with an intuitive interface featuring advanced search, debouncing, and custom filtering.",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-500" />,
      title: "Global Scalability",
      desc: "Built on a modern MERN stack architecture that seamlessly handles complex state management and high API concurrency.",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
      title: "Performance Analytics",
      desc: "Track conversion rates, monitor lead sources, and identify bottlenecks in your sales process with real-time charts.",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: <Users className="w-8 h-8 text-rose-500" />,
      title: "Team Collaboration",
      desc: "Invite colleagues, assign specific leads to representatives, and manage organizational roles effortlessly.",
      bg: "bg-rose-50 dark:bg-rose-900/20"
    },
    {
      icon: <Workflow className="w-8 h-8 text-cyan-500" />,
      title: "Automated Workflows",
      desc: "Set up trigger-based actions to automatically categorize, route, and email leads as soon as they hit your system.",
      bg: "bg-cyan-50 dark:bg-cyan-900/20"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="text-center max-w-3xl mx-auto py-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4 tracking-tight">
          Supercharge your workflow.
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          GigFlow provides enterprise-grade tools designed specifically to help modern sales teams close more deals in less time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map((svc, idx) => (
          <div key={idx} className="group bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className={`w-16 h-16 rounded-2xl ${svc.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {svc.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{svc.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {svc.desc}
            </p>
            <a href="#" className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
              Learn more <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-blue-900/20">
        <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
          <h3 className="text-3xl font-bold mb-2">Ready to transform your pipeline?</h3>
          <p className="text-blue-100 text-lg max-w-xl">Join hundreds of fast-growing companies that use GigFlow to manage their customer relationships.</p>
        </div>
        <button className="whitespace-nowrap px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-colors shadow-lg">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
};

export default Services;
