import { useState, useEffect } from "react";

function Section() {
	const [ideas, setIdeas] = useState([]);

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

	return (
		<section>
			<div className="p-6 max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{ideas.map((item) => {
						const img = item.medium_image?.[0] || item.small_image?.[0];

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
	);
}

export default Section;
