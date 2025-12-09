import { useEffect, useState } from "react";
import "./index.css";

function App() {
	const [ideas, setIdeas] = useState([]);
	const [showHeader, setShowHeader] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	// fetch api
	useEffect(() => {
		const fetchIdeas = async () => {
			try {
				const res = await fetch(
					"/api/ideas?page[number]=1&page[size]=10&append[]=small_image&append[]=medium_image&sort=-published_at",
					{ headers: { Accept: "application/json" } }
				);
				const data = await res.json();
				setIdeas(data.data || []);
			} catch (err) {
				console.error("API ERROR:", err);
			}
		};
		fetchIdeas();
	}, []);

	// navbar
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
		<>
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
							alt=""
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

			<main className="pt-20">
				<header></header>

				<section>
					<div className="p-6 max-w-7xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							{ideas.map((item) => {
								const img =
									item.medium_image?.[0] ||
									item.small_image?.[0] ||
									"https://via.placeholder.com/300x200?text=No+Image";

								{
									/* console.log("IMG", img); */
								}

								return (
									<div key={item.id} className="p-4 rounded-lg shadow-lg">
										<img
											src={img}
											alt={item.title}
											loading="lazy"
											className="w-full h-40 object-cover rounded"
											onError={(e) => {
												e.currentTarget.src =
													"https://via.placeholder.com/300x200?text=No+Image";
											}}
										/>

										<h2 className="text-xl font-semibold mt-3">
											<span className="text-gray-400 text-sm">
												{item.published_at}
											</span>
											<br />
											{item.title}
										</h2>
									</div>
								);
							})}
						</div>
					</div>
				</section>
			</main>
		</>
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

export default App;
