"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menu = [
  { label: 'Dashboard', href: '/superadmin' },
  { label: 'Organisations', href: '/superadmin/organizations' },
  { label: 'Utilisateurs', href: '/superadmin/users' },
  { label: 'Abonnements', href: '/superadmin/subscriptions' },
  { label: 'Feedbacks', href: '/superadmin/feedbacks' },
  { label: 'Logs', href: '/superadmin/logs' },
  { label: 'Paramètres', href: '/superadmin/settings' },
  { label: 'Coupons', href: '/superadmin/coupons' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold">SuperAdmin</div>
      <nav className="flex-1">
        <ul>
          {menu.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-6 py-3 hover:bg-gray-800 rounded transition ${
                  pathname === item.href ? 'bg-gray-800 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 