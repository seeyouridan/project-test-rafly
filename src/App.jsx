import Banner from "./component/Banner.jsx";
import Header from "./component/Header.jsx";
import Section from "./component/Section.jsx";

function App() {
	return (
		<>
			<Header />

			<main className="pt-17">
				<Banner />
				<Section />
			</main>
		</>
	);
}

export default App;
