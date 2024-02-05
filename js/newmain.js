const spinnerParent = document.getElementById('spinnerParent');
const navbar = document.getElementById('navbar');
const sticky = navbar.offsetTop;

function handleScroll() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
}

// Listen for the scroll event
window.addEventListener('scroll', handleScroll);

class GameApp {
    constructor() {
        this.allgames = [];
        this.detailesGame = [];
        this.mainRow = document.getElementById('mainRow');
        this.navItems = document.querySelectorAll('.nav-item');
        this.currentCategory = 'shooter'; // Default category
        // Bind methods to the instance to preserve 'this' context
        this.getGames = this.getGames.bind(this);
        this.setActiveNavItem = this.setActiveNavItem.bind(this);
        this.displayGames = this.displayGames.bind(this);
        // Add click event listeners to navigation items
        this.navItems.forEach(navItem => {
            navItem.addEventListener('click', async eventInfo => {
                const category = eventInfo.target.getAttribute('data-category');
                console.log(category);

                // Update the current category
                this.currentCategory = category;

                // Fetch games based on the selected category
                await this.getGames(category);

                // Set the 'active' class for the clicked navigation item
                this.setActiveNavItem(category);

                // Display games after fetching them
                await this.displayGames();
            });
        });

        // Fetch and display games when the page loads
        window.addEventListener('load', async () => {
            // Assuming you want to display games from a default category on page load
            await this.getGames(this.currentCategory);

            // Set the 'active' class for the default category
            this.setActiveNavItem(this.currentCategory);

            // Display games after fetching them
            await this.displayGames();
        });
    }
    async getGames(category) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'a38900ff7cmsh2c96250e1562660p173b7ajsn4f889a56eef6',
                'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
            },
        };

        // Get the spinner parent element
        const spinnerParent = document.getElementById('spinnerParent');

        try {
            // Show spinner while fetching data
            spinnerParent.classList.remove("d-none");

            const response = await fetch(url, options);
            const result = await response.json();
            this.allgames = result; // Update the array with the new result
            console.log(this.allgames);

            // Hide spinner after data is fetched
            spinnerParent.classList.add("d-none");
        } catch (error) {
            console.error(error);

            // Hide spinner in case of an error
            spinnerParent.classList.add("d-none");
        }
    }

    async getDetailes(id) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'a38900ff7cmsh2c96250e1562660p173b7ajsn4f889a56eef6',
                'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            this.detailesGame = result;
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
    setActiveNavItem(category) {
        // Remove 'active' class from all navigation items
        this.navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Find the navigation item with the matching category and add 'active' class
        const matchingNavItem = Array.from(this.navItems).find(
            item => item.getAttribute('data-category') === category
        );

        if (matchingNavItem) {
            matchingNavItem.classList.add('active');
        }
    }
    async displayGames() {
        this.detailes = document.getElementById('detailes');
        if (this.detailes) {
            let gamesBox = ``;

            for (let i = 0; i < this.allgames.length; i++) {
                const game = this.allgames[i];

                gamesBox += `
                    <div class="col">
                        <div class="card h-100 bg-transparent" data-index="${i}">
                            <div class="card-body">
                                <div class="position-relative mb-3">
                                    <img src="${game.thumbnail}" class="card-img-top object-fit-cover h-100" alt="${game.title}">
                                </div>
                                <div class="caption">
                                    <div class="hstack justify-content-between">
                                        <h3 class="h6 small">${game.title}</h3>
                                        <span class="badge text-bg-primary p-2">Free</span>
                                    </div>
                                    <p class="card-text small text-center opacity-50">${game.short_description}</p>
                                </div>
                            </div>
                            <footer class="card-footer small hstack justify-content-between">
                                <span class="badge badge-color">${game.genre}</span>
                                <span class="badge badge-color">${game.platform}</span>
                            </footer>
                        </div>
                    </div>
                `;
            }

            this.mainRow.innerHTML = gamesBox;

            // Add click event listener to each card
            const cards = document.querySelectorAll('.card');
            const gamesSection = document.getElementById('gamesSection');
            cards.forEach(card => {
                card.addEventListener('click', async event => {
                    const selectedIndex = event.currentTarget.getAttribute('data-index');
                    const selectedGame = this.allgames[selectedIndex];
                    // Fetch details for the selected game
                    try {
                        const details = selectedGame.id
                        const detailsId = selectedGame.id;
                        await this.getDetailes(detailsId);                        // Update details content based on the fetched details
                        this.detailes.innerHTML = `
                            <div class="container mt-3">
                                <header class="d-flex justify-content-between align-items-center">
                                    <h2 id="titleDetailes">${selectedGame.title}</h2>
                                    <button class="btn-close btn-close-white" id="btnDetailesClose"></button>
                                </header>
                                <div class="row g-4 mt-1" id="detailesContent">
                                    <div class="col-md-4">
                                        <img src="${selectedGame.thumbnail}" alt="game pic">
                                    </div>
                                    <div class="col-md-8">
                                        <h3>Title: <span>${selectedGame.title}</span></h3>
                                        <p>Category: <span class="badge text-bg-info">${selectedGame.genre}</span></p>
                                        <p>Platform: <span class="badge text-bg-info">${selectedGame.platform}</span></p>
                                        <p>status: <span class="badge text-bg-info">Live</span></p>
                                        <p class="small">${this.detailesGame.description}</p>
                                        <a href="${selectedGame.freetogame_profile_url}" class="btn btn-outline-warning" target="_blank">Show Game</a>
                                    </div>
                                </div>
                            </div>
                        `;

                        // Show details box and hide games section
                        this.detailes.classList.remove('d-none');
                        gamesSection.classList.add('d-none');
                    } catch (error) {
                        console.error(error);
                    }

                    const btnDetailesClose = document.getElementById('btnDetailesClose');
                    btnDetailesClose.addEventListener('click', () => {
                        this.detailes.classList.add('d-none');
                        gamesSection.classList.remove('d-none');
                    });
                });
            });



            // Add click event listener to the close button
            ;
        } else {
            console.error("Element with ID 'detailes' not found");
        }
    }
}

// Create an instance of GameApp
const gameApp = new GameApp();
