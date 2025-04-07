const resourcesArray = [
    { name: "airbnb", path: "/assets/airbnb.png" },
    { name: "bill", path: "/assets/bill.png" },
    { name: "binance", path: "/assets/binance.png" },
    { name: "card", path: "/assets/card.png" },
    { name: "coinbase", path: "/assets/coinbase.png" },
    { name: "dropbox", path: "/assets/dropbox.png" },
    { name: "logo", path: "/assets/logo.svg" },
    { name: "quotes", path: "/assets/quotes.svg" },
    { name: "robot", path: "/assets/robot.png" },
    { name: "send", path: "/assets/Send.svg" },
    { name: "shield", path: "/assets/Shield.svg" },
    { name: "star", path: "/assets/Star.svg" },
    { name: "menu", path: "/assets/menu.svg" },
    { name: "close", path: "/assets/close.svg" },
    { name: "google", path: "/assets/google.svg" },
    { name: "apple", path: "/assets/apple.svg" },
    { name: "arrowUp", path: "/assets/arrow-up.svg" },
    { name: "discount", path: "/assets/Discount.svg" },
    { name: "facebook", path: "/assets/facebook.svg" },
    { name: "instagram", path: "/assets/instagram.svg" },
    { name: "linkedin", path: "/assets/linkedin.svg" },
    { name: "twitter", path: "/assets/twitter.svg" },
    { name: "people01", path: "/assets/people01.png" },
    { name: "people02", path: "/assets/people02.png" },
    { name: "people03", path: "/assets/people03.png" },
];

const resources = resourcesArray.reduce((acc, resource) => {
    acc[resource.name] = resource.path;
    return acc;
}, {} as { [key: string]: string });

export default resources;
