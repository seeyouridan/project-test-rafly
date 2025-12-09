import { useState, useEffect } from "react";

function Header() {
	const [showHeader, setShowHeader] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;
			const delta = currentY - lastScrollY;

			if (Math.abs(delta) < 5) return;

			if (delta > 0 && currentY > 80) {
				setShowHeader(false);
			} else if (delta < 0) {
				setShowHeader(true);
			}

			setLastScrollY(currentY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<nav
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
				showHeader ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
			} bg-[#f96500]`}
		>
			<div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
				<a href="/">
					<img
						src="https://suitmedia.com/_ipx/w_200&f_webp&q_100/assets/img/site-logo.png"
						className="h-9 brightness-0 invert-[1]"
						alt="Logo"
					/>
				</a>

				<ul className="flex gap-6 text-sm font-medium">
					<NavItem href="#" label="Work" />
					<NavItem href="#" label="About" />
					<NavItem href="#" label="Services" />
					<NavItem href="/" label="Ideas" />
					<NavItem href="#" label="Careers" />
					<NavItem href="#" label="Contact" />
				</ul>
			</div>
		</nav>
	);
}

function NavItem({ href, label }) {
	const isActive = window.location.pathname === href;

	return (
		<li>
			<a
				href={href}
				className={
					"transition-colors " +
					(isActive
						? "text-white border-b-2 border-white pb-1"
						: "text-white hover:text-gray-800")
				}
			>
				{label}
			</a>
		</li>
	);
}

export default Header;
