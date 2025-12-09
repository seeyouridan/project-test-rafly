import { useState, useEffect } from "react";

function Header() {
	const [showHeader, setShowHeader] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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

	const navItems = [
		{ href: "#", label: "Work" },
		{ href: "#", label: "About" },
		{ href: "#", label: "Services" },
		{ href: "/", label: "Ideas" },
		{ href: "#", label: "Careers" },
		{ href: "#", label: "Contact" },
	];

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

				<ul className="hidden md:flex gap-6 text-sm font-medium">
					{navItems.map((item) => (
						<NavItem key={item.href} href={item.href} label={item.label} />
					))}
				</ul>

				<button
					className="md:hidden flex flex-col justify-between w-6 h-6 focus:outline-none"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					<span
						className={`block h-0.5 w-full bg-white transition-all ${
							isMenuOpen ? "rotate-45 translate-y-2" : ""
						}`}
					/>
					<span
						className={`block h-0.5 w-full bg-white transition-all ${
							isMenuOpen ? "opacity-0" : ""
						}`}
					/>
					<span
						className={`block h-0.5 w-full bg-white transition-all ${
							isMenuOpen ? "-rotate-45 -translate-y-2" : ""
						}`}
					/>
				</button>
			</div>

			{isMenuOpen && (
				<ul className="md:hidden flex flex-col bg-[#f96500] w-full px-6 pb-4 gap-4">
					{navItems.map((item) => (
						<NavItem
							key={item.href}
							href={item.href}
							label={item.label}
							onClick={() => setIsMenuOpen(false)}
						/>
					))}
				</ul>
			)}
		</nav>
	);
}

function NavItem({ href, label, onClick }) {
	const isActive = window.location.pathname === href;

	return (
		<li>
			<a
				href={href}
				onClick={onClick}
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
