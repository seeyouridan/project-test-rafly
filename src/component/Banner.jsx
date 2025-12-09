import { useState, useEffect } from "react";

function Banner() {
	const [scrollY, setScrollY] = useState(0);
	const [bannerList, setBannerList] = useState([]);

	// Scroll effect
	useEffect(() => {
		const onScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const fetchBanner = async () => {
			try {
				const res = await fetch(
					"https://693837244618a71d77cf66d0.mockapi.io/banner"
				);
				const data = await res.json();
				setBannerList(data);
			} catch (err) {
				console.error("Error fetching banner:", err);
			}
		};
		fetchBanner();
	}, []);

	return (
		<div>
			{bannerList.map((banner) => (
				<header
					key={banner.id}
					className="relative h-80 md:h-[470px] overflow-hidden mb-10"
				>
					<div
						className="absolute inset-0 will-change-transform"
						style={{ transform: `translateY(${scrollY * 0.2}px)` }}
					>
						<img
							src={banner.imageUrl}
							alt={banner.title}
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/40" />
					</div>

					<div
						className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6"
						style={{ transform: `translateY(${scrollY * -0.2}px)` }}
					>
						<div className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
								{banner.title}
							</h1>
							<p className="text-white/80 max-w-md m-auto">{banner.subtitle}</p>
						</div>
					</div>

					<div className="absolute bottom-0 left-0 w-full h-25 md:h-50 overflow-hidden">
						<div className="w-full h-full bg-white [clip-path:polygon(100%_0%,0%_100%,100%_100%)]" />
					</div>
				</header>
			))}
		</div>
	);
}

export default Banner;
