const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

//Theme toggler elements

const themeToggler = document.getElementById("theme-toggler");
const body = document.body;

async function searchWiki(query) {
	const encodedQuery = encodeURIComponent(query);
	const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

	const response = await fetch(endpoint);

	if (!response.ok) {
		throw new Error("Faild to fetch search rdsults from Wikipedia API");
	}

	const json = await response.json();
	return json;
}

function showResults(results) {
	//Remove the loading spinner
	searchResults.innerHTML = "";

	results.forEach((result) => {
		const url = `https://en.wikipedia.org/?curid=${results.pageid}`;
		const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title} </a>`;
		const urlLink = `<a href="${url} class="result-link" target="_blank" rel="noopener">${url}</a>`;

		const resultItme = document.createElement("div");
		resultItme.className = "result-item";
		resultItme.innerHTML = `
        <h3 class="result-title">${titleLink}</h3>
        ${urlLink}
        <p class="result-snippet">${result.snippet}</p>
        `;

		searchResults.appendChild(resultItme);
	});
}

searchForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const query = searchInput.value.trim();

	if (!query) {
		searchResults.innerHTML = "<p>Please enter a valid search term... </p>";
		return;
	}

	  searchResults.innerHTML = "<div class='spinner'>Loading ... </div>";

	try {
		const results = await searchWiki(query);

		if (results.query.searchinfo.totalhits === 0) {
			searchResults.innerHTML = "<p>No results found... </p>";
		} else {
			showResults(results.query.search);
		}
	} catch (error) {
		console.error(error);
		searchResults.innerHTML = `<p>An error occured while searching. Please try again later... </p>`;
	}
});


//event listner for Theme toggler
themeToggler.addEventListener("click", () => {
	body.classList.toggle("dark-theme");
	if (body.classList.contains("dark-theme")) {
		themeToggler.textContent = "Dark";
		themeToggler.style.background = "#fff";
		themeToggler.style.color = "#333";
	} else {
		themeToggler.textContent = "Light";
		themeToggler.style.border = "2px solid #ccc";
		themeToggler.style.color = "#333";
	}
});

