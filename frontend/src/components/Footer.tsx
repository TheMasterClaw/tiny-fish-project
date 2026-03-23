import React from 'react';
import { 
  Waves, 
  Github, 
  Twitter, 
  MessageCircle, 
  ExternalLink, 
  Heart,
  Mail,
  MapPin,
  FileText,
  Shield
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Reef Dashboard', href: '#dashboard' },
      { label: 'NFT Collection', href: '#nft' },
      { label: 'Conservation Actions', href: '#actions' },
      { label: 'Guardian Profile', href: '#profile' },
      { label: 'Impact Reports', href: '#impact' },
    ],
    resources: [
      { label: 'Documentation', href: '#', external: true },
      { label: 'API Reference', href: '#', external: true },
      { label: 'Smart Contracts', href: '#', external: true },
      { label: 'Whitepaper', href: '#', external: true },
      { label: 'Brand Kit', href: '#', external: true },
    ],
    company: [
      { label: 'About Us', href: '#', external: true },
      { label: 'Careers', href: '#', external: true },
      { label: 'Press Kit', href: '#', external: true },
      { label: 'Contact', href: '#', external: true },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#', external: true },
      { label: 'Terms of Service', href: '#', external: true },
      { label: 'Cookie Policy', href: '#', external: true },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/coralguard', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/coralguard', label: 'GitHub' },
    { icon: MessageCircle, href: 'https://discord.gg/coralguard', label: 'Discord' },
    { icon: Mail, href: 'mailto:hello@coralguard.org', label: 'Email' },
  ];

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Waves className="w-10 h-10 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full" />
              </div>
              <div>
                <span className="text-2xl font-bold">
                  Coral
                  <span className="text-coral-400">Guard</span>
                </span>
              </div>
            </div>

            <p className="text-white/60 mb-6 max-w-sm leading-relaxed">
              Combining AI and blockchain to monitor, protect, and restore coral reef ecosystems. 
              Join the decentralized network for ocean conservation.
            </p>

            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white/50">Global operations, HQ in San Francisco</span>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/50">
              © {currentYear} CoralGuard. Built with{' '}
              <Heart className="w-4 h-4 inline text-coral-400" /> for the oceans.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Shield className="w-4 h-4 text-reef-400" />
                <span>Audited by CertiK</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/50">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Tiny Fish Hackathon 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
