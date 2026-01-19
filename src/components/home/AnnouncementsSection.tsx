import React from 'react';
import { Megaphone, Percent, Tag, Star, Bell, Gift, PartyPopper } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAdmin';
import { useCity } from '@/contexts/CityContext';
import { toast } from 'sonner';

const ICONS = {
  Megaphone,
  Percent,
  Tag,
  Star,
  Bell,
  Gift,
  PartyPopper
};

const AnnouncementsSection: React.FC = () => {
  const { selectedCity } = useCity();
  const { data: announcements, isLoading } = useAnnouncements();

  if (isLoading || !announcements || announcements.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Percent className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Special Offers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {announcements.map((announcement: any) => {
            const Icon = ICONS[announcement.icon_type as keyof typeof ICONS] || Megaphone;
            const code = announcement.promo_code || announcement.title.split(' ')[0].toUpperCase() + (Math.floor(Math.random() * 50) + 10);

            return (
              <div
                key={announcement.id}
                className={`group relative overflow-hidden rounded-xl p-4 min-h-[180px] flex flex-col justify-between transition-all hover:scale-105 shadow-md hover:shadow-lg bg-gradient-to-br ${announcement.color_from} ${announcement.color_to}`}
              >
                <div className="relative z-10 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-5 w-5 text-white/90" />
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wider border border-white/10 uppercase">
                      Limited
                    </span>
                  </div>
                  <div className="text-left w-full">
                    <h3 className="text-lg font-bold text-white leading-tight mb-1 line-clamp-1">{announcement.title}</h3>
                    <p className="text-white/80 text-xs font-medium line-clamp-2">
                      {announcement.content}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-3 flex items-center gap-2 w-full">
                  <div className="flex-1 bg-white/20 backdrop-blur-md px-2 py-1.5 rounded text-white font-mono font-bold tracking-wider text-xs border border-white/10 select-all text-center">
                    {code}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      toast.success('Code copied to clipboard!');
                    }}
                    className="bg-white text-black hover:bg-white/90 backdrop-blur-md px-3 py-1.5 rounded font-bold text-xs transition-colors shadow-sm active:scale-95 transform"
                  >
                    Copy
                  </button>
                </div>

                {/* Background Icon */}
                <div className="absolute -right-4 -bottom-4 text-white/10 transform rotate-12 transition-transform group-hover:scale-110 pointer-events-none">
                  <Icon size={100} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
