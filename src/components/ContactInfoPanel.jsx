import { FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'

const ContactInfoPanel = ({ data }) => {
  const items = [
    { icon: FiMail, label: 'Email', value: data.email, href: `mailto:${data.email}` },
    { icon: FiMapPin, label: 'Location', value: data.location },
    { icon: FiClock, label: 'Response time', value: data.responseTime },
  ]

  const socials = [
    { icon: FaGithub, href: data.socials.github, label: 'GitHub' },
    { icon: FaLinkedin, href: data.socials.linkedin, label: 'LinkedIn' },
    { icon: FaXTwitter, href: data.socials.twitter, label: 'Twitter / X' },
  ]

  return (
    <div className="flex h-full flex-col p-6 md:p-8">
      <h3 className="mb-6 font-['Space_Grotesk'] text-xl font-semibold text-[#f1f5f9]">
        Contact Info
      </h3>

      <ul className="flex flex-1 flex-col gap-5">
        {items.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex items-start gap-3">
            <Icon className="mt-0.5 shrink-0 text-[var(--skyblue)]" size={18} aria-hidden />
            <div>
              <p className="text-xs uppercase tracking-wider text-[#94a3b8]">{label}</p>
              {href ? (
                <a
                  href={href}
                  data-cursor="hover"
                  className="font-['Space_Grotesk'] text-[#f1f5f9] transition-colors
                    hover:text-[var(--mint)]"
                >
                  {value}
                </a>
              ) : (
                <p className="font-['Space_Grotesk'] text-[#f1f5f9]">{value}</p>
              )}
            </div>
          </li>
        ))}

        <li className="flex items-center gap-3">
          <span
            className="status-dot inline-block h-2.5 w-2.5 rounded-full bg-[var(--green)]"
            aria-hidden
          />
          <span className="font-['Space_Grotesk'] text-sm font-medium text-[var(--green)]">
            {data.status}
          </span>
        </li>
      </ul>

      <div className="mt-8 flex gap-4">
        {socials.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-cursor="hover"
            className="text-[var(--skyblue)] transition-colors hover:text-[var(--mint)]"
          >
            <Icon size={22} />
          </a>
        ))}
      </div>

      <div
        className="mt-6 h-0.5 w-full rounded-full
          bg-gradient-to-r from-[var(--mint)] to-[var(--skyblue)]"
        aria-hidden
      />
    </div>
  )
}

export default ContactInfoPanel
