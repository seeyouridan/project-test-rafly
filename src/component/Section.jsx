import { useState, useEffect } from "react";

function ImageCard({ src, alt }) {
	const [imgSrc, setImgSrc] = useState(null);

	useEffect(() => {
		let isMounted = true;

		const loadImage = async () => {
			try {
				const res = await fetch(src);
				const blob = await res.blob();
				if (isMounted) setImgSrc(URL.createObjectURL(blob));
			} catch (err) {
				console.error("Image load error:", err);
				if (isMounted) setImgSrc("https://placehold.co/300x200?text=No+Image");
			}
		};

		loadImage();

		return () => {
			isMounted = false;
		};
	}, [src]);

	return (
		<img
			src={imgSrc || "https://placehold.co/300x200?text=Loading..."}
			alt={alt}
			loading="lazy"
			className="w-full h-48 object-cover"
		/>
	);
}

function Section() {
	const savedPage = parseInt(localStorage.getItem("currentPage")) || 1;
	const savedPerPage = parseInt(localStorage.getItem("perPage")) || 10;
	const savedSort = localStorage.getItem("sortOrder") || "newest";

	const [ideas, setIdeas] = useState([]);
	const [currentPage, setCurrentPage] = useState(savedPage);
	const [perPage, setPerPage] = useState(savedPerPage);
	const [sortOrder, setSortOrder] = useState(savedSort);
	const [totalItems, setTotalItems] = useState(0);

	const perPageOptions = [10, 20, 50];

	const fetchIdeas = async (page = 1, perPage = 10, sort = "newest") => {
		try {
			const sortParam = sort === "newest" ? "-published_at" : "published_at";
			const res = await fetch(
				`/api/ideas?page[number]=${page}&page[size]=${perPage}&append[]=small_image&append[]=medium_image&sort=${sortParam}`,
				{ headers: { Accept: "application/json" } }
			);
			const data = await res.json();
			setIdeas(data.data || []);
			setTotalItems(data.meta?.total || 100);
		} catch (err) {
			console.error("API ERROR:", err);
		}
	};

	useEffect(() => {
		fetchIdeas(currentPage, perPage, sortOrder);
		localStorage.setItem("currentPage", currentPage);
		localStorage.setItem("perPage", perPage);
		localStorage.setItem("sortOrder", sortOrder);
	}, [currentPage, perPage, sortOrder]);

	const totalPages = Math.ceil(totalItems / perPage);

	const handlePerPageChange = (e) => {
		const newPerPage = Number(e.target.value);
		setPerPage(newPerPage);
		setCurrentPage(1);
	};

	const handleSortChange = (e) => {
		setSortOrder(e.target.value);
		setCurrentPage(1);
	};

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	return (
		<section className="py-8">
			<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row text-xs md:text-base justify-between items-center mb-6 gap-4">
				<div className="text-gray-700">
					Showing {(currentPage - 1) * perPage + 1} -{" "}
					{Math.min(currentPage * perPage, totalItems)} of {totalItems} items
				</div>
				<div className="flex gap-4 items-center">
					<div>
						Show per page:{" "}
						<select
							value={perPage}
							onChange={handlePerPageChange}
							className="border border-gray-200 rounded-4xl pr-15 pl-2 py-2"
						>
							{perPageOptions.map((n) => (
								<option className="w-10" key={n} value={n}>
									{n}
								</option>
							))}
						</select>
					</div>

					<div>
						Sort by:{" "}
						<select
							value={sortOrder}
							onChange={handleSortChange}
							className="border border-gray-200 rounded-4xl pr-15 pl-2 py-2"
						>
							<option value="newest">Newest</option>
							<option value="oldest">Oldest</option>
						</select>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 pt-5">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
					{ideas.map((item) => {
						const img =
							item.medium_image?.[0]?.url || item.small_image?.[0]?.url;

						return (
							<div
								key={item.id}
								className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
							>
								<ImageCard src={img} alt={item.title} />
								<div className="p-4 flex flex-col flex-1">
									<span className="text-gray-400 text-sm mb-2">
										{new Date(item.published_at).toLocaleDateString("id-ID", {
											day: "2-digit",
											month: "long",
											year: "numeric",
										})}
									</span>
									<h3 className="text-lg font-semibold text-gray-800 flex-1 line-clamp-3">
										{item.title}
									</h3>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 mt-6 flex justify-center gap-0 sm:gap-1 md:gap-2 text-xs md:text-base flex-wrap text-gray-700">
				{/* button kiri */}
				<button
					onClick={() => handlePageChange(1)}
					className="px-3 py-1 rounded hover:bg-[#ff822f] font-bold transition-all hover:text-white duration-300 disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-300"
					disabled={currentPage === 1}
				>
					&lt;&lt;
				</button>
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					className="px-3 py-1 rounded hover:bg-[#ff822f] font-bold transition-all hover:text-white duration-300 disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-300"
					disabled={currentPage === 1}
				>
					&lt;
				</button>

				{/* button page */}
				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.slice(
						Math.max(0, currentPage - 3),
						Math.min(totalPages, currentPage + 2)
					)
					.map((page) => (
						<button
							key={page}
							onClick={() => handlePageChange(page)}
							className={`px-3 py-1 rounded hover:bg-[#ff822f] font-bold transition-all hover:text-white duration-300 ${
								page === currentPage
									? "bg-[#f96500] font-normal text-white"
									: ""
							}`}
						>
							{page}
						</button>
					))}

				{/* button kanan */}
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					className="px-3 py-1 rounded hover:bg-[#ff822f] font-bold transition-all hover:text-white duration-300 disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-300"
					disabled={currentPage === totalPages}
				>
					&gt;
				</button>
				<button
					onClick={() => handlePageChange(totalPages)}
					className="px-3 py-1 rounded hover:bg-[#ff822f] font-bold transition-all hover:text-white duration-300 disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-300"
					disabled={currentPage === totalPages}
				>
					&gt;&gt;
				</button>
			</div>
		</section>
	);
}

export default Section;
