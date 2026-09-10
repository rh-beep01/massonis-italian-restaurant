export const menuData = {
  categories: [
    { id: 'all', label: 'Full Menu', icon: 'Utensils' },
    { id: 'starters', label: 'Antipasti & Starters', icon: 'Soup' },
    { id: 'pastas', label: 'Handcrafted Pastas', icon: 'Wheat' },
    { id: 'pizzas', label: 'Artisan Pizza & Flatbreads', icon: 'Pizza' },
    { id: 'entrees', label: 'Chef Entrees', icon: 'Flame' },
    { id: 'desserts', label: 'Homemade Gelato & Sweets', icon: 'IceCream' },
    { id: 'drinks', label: 'Wines & Craft Cocktails', icon: 'Wine' }
  ],
  items: [
    // --- STARTERS & ANTIPASTI ---
    {
      id: 'starter-spaghetti-eggrolls',
      name: 'Signature Spaghetti Eggrolls',
      italianName: 'Involtini di Spaghetti alla Massoni',
      category: 'starters',
      price: 13.95,
      badge: 'House Famous Signature',
      isSignature: true,
      description: 'Crispy golden fried eggrolls packed with tender al dente spaghetti, savory Italian sausage bolognese, and melted whole-milk mozzarella. Served with warm house-made San Marzano marinara dipping sauce.',
      image: '/spaghetti-eggrolls.jpg',
      options: [
        { name: 'Classic Bolognese & Mozzarella', priceDelta: 0 },
        { name: 'Spicy Fra Diavolo Style', priceDelta: 1.00 },
        { name: 'Four Cheese Vegetarian', priceDelta: 0 }
      ],
      addOns: [
        { name: 'Extra Side Marinara (4 oz)', price: 1.50 },
        { name: 'Garlic Herb Dipping Butter', price: 1.75 },
        { name: 'Grated Aged Parmigiano-Reggiano', price: 1.50 }
      ]
    },
    {
      id: 'starter-calamari',
      name: 'Crispy Calamari Fritti',
      italianName: 'Calamari Fritti alla Romana',
      category: 'starters',
      price: 15.50,
      badge: 'Guest Favorite',
      isSignature: true,
      description: 'Tender wild-caught calamari rings and tentacles lightly dusted in seasoned Italian flour, flash fried golden brown, tossed with sweet cherry peppers, and served with house marinara and grilled lemon.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Traditional Marinara Dipping', priceDelta: 0 },
        { name: 'Sweet Chili Garlic Glaze', priceDelta: 1.50 },
        { name: 'Spicy Fra Diavolo Sauce', priceDelta: 1.00 }
      ],
      addOns: [
        { name: 'Side of Lemon-Garlic Aioli', price: 1.75 }
      ]
    },
    {
      id: 'starter-bruschetta',
      name: 'Bruschetta Rustica al Pomodoro',
      italianName: 'Bruschetta Tradizionale',
      category: 'starters',
      price: 11.25,
      badge: 'Vegetarian',
      description: 'Grilled artisanal rustic Italian bread rubbed with roasted garlic, topped with marinated heirloom tomatoes, fresh Genovese basil, aged Modena balsamic reduction, and shaved pecorino.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Classic Heirloom Tomato & Basil', priceDelta: 0 },
        { name: 'Crowned with Creamy Burrata Cheese', priceDelta: 3.50 }
      ],
      addOns: [
        { name: 'Add Prosciutto di Parma (2 Slices)', price: 3.95 }
      ]
    },
    {
      id: 'starter-garlic-knots',
      name: 'Garlic Herb Focaccia Knots (6-Pack)',
      italianName: "Nodini all'Aglio e Parmigiano",
      category: 'starters',
      price: 8.95,
      badge: 'Fresh Baked Daily',
      description: 'Oven-baked fluffy pizza dough knots drenched in roasted garlic butter, fresh Italian parsley, cracked black pepper, and pecorino romano cheese. Served with warm dipping marinara.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Half Dozen (6 Knots)', priceDelta: 0 },
        { name: "Baker's Dozen (13 Knots)", priceDelta: 6.50 }
      ],
      addOns: [
        { name: 'Melted Mozzarella Baked Over Top', price: 2.25 }
      ]
    },
    {
      id: 'starter-caprese',
      name: 'Caprese Fior di Latte',
      italianName: 'Insalata Caprese Tradizionale',
      category: 'starters',
      price: 12.95,
      badge: 'Gluten-Free',
      description: 'Thick slices of vine-ripened beefsteak tomatoes, fresh artisan mozzarella, fresh Genovese basil leaves, sea salt, extra virgin olive oil, and aged Modena balsamic drizzle.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Classic Fresh Mozzarella', priceDelta: 0 },
        { name: 'Upgrade to Creamy Stracciatella Burrata', priceDelta: 3.50 }
      ]
    },

    // --- HANDCRAFTED PASTAS ---
    {
      id: 'pasta-fettuccine-alfredo',
      name: 'Handcrafted Fettuccine Alfredo',
      italianName: 'Fettuccine Tradizionale Alfredo',
      category: 'pastas',
      price: 18.95,
      badge: 'Guest Favorite',
      isSignature: true,
      description: 'Fresh egg fettuccine ribbons tossed in a rich, velvety emulsion of sweet European butter, heavy cream, cracked black pepper, and imported 24-month aged Parmigiano-Reggiano.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Classic Pasta Portion', priceDelta: 0 },
        { name: 'Family Size (Serves 2-3 Guests)', priceDelta: 16.00 }
      ],
      pastaTypes: ['Traditional Egg Fettuccine', 'Gluten-Free Penne (+$3.00)', 'Whole Wheat Linguine'],
      addOns: [
        { name: 'Herb-Grilled Chicken Breast', price: 5.50 },
        { name: 'Pan-Seared Jumbo Gulf Shrimp (4 pcs)', price: 7.95 },
        { name: 'Sautéed Garlic Cremini Mushrooms', price: 3.50 },
        { name: 'Steamed Broccoli Florets', price: 2.95 }
      ]
    },
    {
      id: 'pasta-spaghetti-meatballs',
      name: "Spaghetti & Nonna's Meatballs",
      italianName: 'Spaghetti con Polpette della Nonna',
      category: 'pastas',
      price: 19.50,
      badge: 'Family Secret Recipe',
      isSignature: true,
      description: "Artisanal spaghetti simmered in slow-cooked San Marzano marinara, crowned with two colossal handmade beef & veal meatballs, fresh basil, and grated pecorino.",
      image: '/spaghetti-eggrolls.jpg',
      options: [
        { name: 'Two Colossal House Meatballs', priceDelta: 0 },
        { name: 'Three House Meatballs', priceDelta: 3.75 }
      ],
      pastaTypes: ['Classic Spaghetti', 'Gluten-Free Penne (+$3.00)', 'Rigatoni Rigate'],
      addOns: [
        { name: 'Extra Meatball (1 Large)', price: 3.75 },
        { name: 'Sweet Italian Sausage Link', price: 4.25 },
        { name: 'Melted Mozzarella Baked Over Top', price: 2.50 }
      ]
    },
    {
      id: 'pasta-lasagna',
      name: 'Lasagna Bolognese al Forno',
      italianName: 'Lasagne alla Bolognese Tradizionale',
      category: 'pastas',
      price: 21.00,
      badge: 'Slow Baked 4 Hours',
      isSignature: true,
      description: 'Layer upon layer of fresh pasta sheets, slow-simmered beef & pork Bolognese ragù, creamy whole-milk ricotta, melted mozzarella, and fragrant garden herbs, baked until bubbling golden brown.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Single Hearty Portion', priceDelta: 0 },
        { name: 'Family Platter (Serves 3-4)', priceDelta: 28.00 }
      ],
      addOns: [
        { name: "Side of Nonna's Meatball", price: 3.75 },
        { name: 'Garlic Bread Slice with Mozzarella', price: 2.50 }
      ]
    },
    {
      id: 'pasta-penne-vodka',
      name: 'Penne alla Vodka con Prosciutto',
      italianName: 'Penne alla Vodka e Pancetta',
      category: 'pastas',
      price: 19.25,
      badge: "Chef's Pride",
      description: 'Penne pasta tossed in our famous pink cream reduction of San Marzano tomatoes, premium vodka, caramelized shallots, and crispy Italian pancetta, finished with grated pecorino.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'With Crispy Italian Pancetta', priceDelta: 0 },
        { name: 'Vegetarian (No Pancetta)', priceDelta: 0 }
      ],
      pastaTypes: ['Penne Rigate', 'Gluten-Free Penne (+$3.00)', 'Egg Fettuccine'],
      addOns: [
        { name: 'Add Herb-Grilled Chicken Breast', price: 5.50 },
        { name: 'Add Jumbo Shrimp (4 pcs)', price: 7.95 },
        { name: 'Add Fresh Burrata Crown', price: 4.50 }
      ]
    },
    {
      id: 'pasta-lobster-ravioli',
      name: 'Artisan Lobster Ravioli',
      italianName: "Ravioli all'Aragosta e Zafferano",
      category: 'pastas',
      price: 24.95,
      badge: 'Signature Seafood',
      description: 'Striped artisan ravioli filled with sweet Maine lobster claw meat and fresh ricotta, bathed in a saffron tomato sherry cream sauce with wilted baby spinach.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Saffron Tomato Cream Sauce', priceDelta: 0 },
        { name: 'Lemon Garlic White Wine Butter Sauce', priceDelta: 0 }
      ],
      addOns: [
        { name: 'Add 3 Jumbo Grilled Shrimp', price: 6.95 }
      ]
    },

    // --- ARTISAN PIZZAS & FLATBREADS ---
    {
      id: 'pizza-margherita',
      name: 'Margherita Classica Wood-Fired',
      italianName: 'Pizza Margherita Verace DOC',
      category: 'pizzas',
      price: 17.50,
      badge: 'Stone Hearth Baked',
      isSignature: true,
      description: 'San Marzano D.O.P. tomato sauce, fresh Fior di Latte mozzarella, extra virgin olive oil, grated Pecorino Romano, and hand-torn fresh basil on our 48-hour fermented crust.',
      image: '/artisan-pizza.jpg',
      options: [
        { name: '12" Personal Artisan Pie (6 Slices)', priceDelta: 0 },
        { name: '16" Large Stone Hearth Pie (8 Slices)', priceDelta: 5.50 },
        { name: '12" Cauliflower Gluten-Free Crust', priceDelta: 4.00 }
      ],
      addOns: [
        { name: 'Cupping Pepperoni Slices', price: 2.50 },
        { name: 'Spicy Hot Honey Drizzle', price: 1.50 },
        { name: 'Fresh Wild Arugula & Shaved Parm', price: 2.25 },
        { name: 'Imported Sicilian Anchovies', price: 2.00 }
      ]
    },
    {
      id: 'pizza-carnivoro',
      name: "Il Carnivoro (Meat Lover's)",
      italianName: 'Pizza Carnivora alla Massoni',
      category: 'pizzas',
      price: 21.95,
      badge: 'Hearty Favorite',
      description: 'Zesty red sauce, shredded mozzarella, spicy pepperoni, Italian sweet rope sausage, seasoned ground beef, applewood bacon, and cured prosciutto.',
      image: '/artisan-pizza.jpg',
      options: [
        { name: '12" Artisan Pie', priceDelta: 0 },
        { name: '16" Large Stone Hearth Pie', priceDelta: 6.00 }
      ],
      addOns: [
        { name: 'Hot Cherry Pepper Slices', price: 1.75 },
        { name: 'Extra Mozzarella Cheese Blanket', price: 2.50 }
      ]
    },
    {
      id: 'pizza-prosciutto-arugula',
      name: 'Prosciutto di Parma & Arugula Flatbread',
      italianName: 'Focaccia Rustica con Prosciutto e Rucola',
      category: 'pizzas',
      price: 19.50,
      badge: 'Artisan Specialty',
      description: 'Roasted garlic extra virgin olive oil base with melted mozzarella and fontina, baked crisp then draped with 18-month aged prosciutto di Parma, wild baby arugula, and balsamic glaze.',
      image: '/artisan-pizza.jpg',
      options: [
        { name: 'Artisan Flatbread (14" Oblong)', priceDelta: 0 },
        { name: '16" Round Stone-Fired Pie', priceDelta: 4.50 }
      ],
      addOns: [
        { name: 'White Truffle Oil Drizzle', price: 2.00 }
      ]
    },
    {
      id: 'pizza-white-ricotta',
      name: 'Pizza Bianca (Four Cheese White)',
      italianName: 'Pizza Bianca ai Quattro Formaggi',
      category: 'pizzas',
      price: 18.50,
      badge: 'Vegetarian',
      description: 'Garlic infused olive oil, seasoned whole-milk ricotta dollops, whole milk mozzarella, aged provolone, and creamy gorgonzola dolce with fresh oregano.',
      image: '/artisan-pizza.jpg',
      options: [
        { name: '12" Artisan Pie', priceDelta: 0 },
        { name: '16" Large Stone Hearth Pie', priceDelta: 5.50 }
      ],
      addOns: [
        { name: 'Sautéed Baby Spinach', price: 2.00 },
        { name: 'Caramelized Sweet Onions', price: 1.75 }
      ]
    },

    // --- CHEF ENTREES ---
    {
      id: 'entree-chicken-parm',
      name: 'Chicken Parmigiana Tradizionale',
      italianName: 'Pollo alla Parmigiana al Forno',
      category: 'entrees',
      price: 22.95,
      badge: 'All-Time Best Seller',
      isSignature: true,
      description: 'Tender chicken cutlet hand-breaded in Italian herb crumbs, lightly crisped, topped with savory marinara and a blanket of melted whole-milk mozzarella. Served with a side of spaghetti marinara.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Served with Spaghetti Marinara Side', priceDelta: 0 },
        { name: 'Served with Fettuccine Alfredo Side', priceDelta: 3.50 },
        { name: 'Served with Garlic Roasted Potatoes & Green Beans', priceDelta: 2.50 }
      ],
      addOns: [
        { name: 'Extra Melted Provolone', price: 2.00 },
        { name: 'Add Roasted Sweet Bell Peppers', price: 2.25 }
      ]
    },
    {
      id: 'entree-veal-piccata',
      name: 'Veal Scallopini al Limone & Capers',
      italianName: 'Scaloppine di Vitello al Limone',
      category: 'entrees',
      price: 26.50,
      badge: 'Chef Specialty',
      description: 'Delicate milk-fed veal scallopini pan-seared with shallots, white Pinot Grigio wine, fresh squeezed lemon juice, garlic butter, and briny Mediterranean capers over angel hair pasta.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Over Angel Hair Pasta', priceDelta: 0 },
        { name: 'Over Sautéed Spinach & Garlic', priceDelta: 2.00 }
      ]
    },
    {
      id: 'entree-salmon',
      name: 'Pan-Seared Atlantic Salmon Rustica',
      italianName: 'Salmone alla Griglia con Erbe',
      category: 'entrees',
      price: 25.95,
      badge: 'Healthy & Fresh',
      description: 'Crispy skin Atlantic salmon fillet pan-roasted with rosemary, garlic, blistered cherry tomatoes, kalamata olives, and a light white wine sauce. Served with seasonal roasted vegetables.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Medium Well (Chef Recommendation)', priceDelta: 0 },
        { name: 'Well Done', priceDelta: 0 }
      ]
    },
    {
      id: 'entree-eggplant-parm',
      name: 'Eggplant Parmigiana al Forno',
      italianName: 'Melanzane alla Parmigiana',
      category: 'entrees',
      price: 19.95,
      badge: 'Vegetarian Classic',
      description: 'Thinly sliced tender eggplant layered with fresh basil, pecorino cheese, San Marzano tomato sauce, and golden mozzarella. Baked until bubbly and fragrant. Served with penne pasta.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Served with Penne Pomodoro', priceDelta: 0 },
        { name: 'Served with Crisp Garden Salad', priceDelta: 0 }
      ]
    },

    // --- HOMEMADE GELATO & DESSERTS ---
    {
      id: 'dessert-famous-ice-cream',
      name: 'Famous Homemade Artisan Ice Cream (Gelato)',
      italianName: 'Gelato Artigianale Fatto in Casa',
      category: 'desserts',
      price: 6.95,
      badge: 'Massoni Family Specialty',
      isSignature: true,
      description: "Made fresh in-house weekly with pure dairy and imported Italian ingredients. Massoni's is renowned throughout Nottingham & Perry Hall for this ultra-smooth, decadent treat.",
      image: '/italian-desserts.jpg',
      options: [
        { name: 'Single Waffle Dish (1 Flavor)', priceDelta: 0 },
        { name: 'Double Scoop Dish (Up to 2 Flavors)', priceDelta: 2.50 },
        { name: 'Pint To-Go Freezer Tub', priceDelta: 5.50 }
      ],
      gelatoFlavors: [
        'Sicilian Roasted Pistachio',
        'Stracciatella (Sweet Cream & Shaved Chocolate)',
        'Dark Espresso Chocolate Chip',
        'Amarena Wild Cherry Swirl',
        'Madagascar Bourbon Vanilla Bean',
        'Rich Double Belgian Chocolate'
      ],
      addOns: [
        { name: 'Warm Chocolate Fudge Drizzle', price: 1.00 },
        { name: 'Toasted Crushed Pistachios', price: 1.25 },
        { name: 'Hand-Whipped Sweet Cream', price: 0.75 }
      ]
    },
    {
      id: 'dessert-cannoli',
      name: 'Crispy Sicilian Cannoli (2-Pack)',
      italianName: 'Cannoli Siciliani alla Ricotta',
      category: 'desserts',
      price: 8.50,
      badge: 'Filled to Order',
      isSignature: true,
      description: 'Two golden fried pastry shells piped fresh to order with sweet impastata ricotta, mini dark chocolate chips, citrus zest, and dusted with powdered sugar and crushed pistachios.',
      image: '/italian-desserts.jpg',
      options: [
        { name: 'Traditional Chocolate Chip & Pistachio', priceDelta: 0 },
        { name: 'Chocolate-Dipped Pastry Shells', priceDelta: 1.50 }
      ],
      addOns: [
        { name: 'Add Extra Single Cannoli', price: 4.00 }
      ]
    },
    {
      id: 'dessert-tiramisu',
      name: 'Tiramisu Classico della Casa',
      italianName: 'Tiramisù Tradizionale',
      category: 'desserts',
      price: 9.25,
      badge: 'Italian Classic',
      description: 'Italian Savoiardi ladyfingers soaked in dark roast espresso and coffee liqueur, layered with cloud-like mascarpone cream, and generously dusted with Dutch cocoa powder.',
      image: '/italian-desserts.jpg',
      options: [
        { name: 'Individual Dining Slice', priceDelta: 0 },
        { name: 'Whole Cake (Serves 8-10, 24 hr notice)', priceDelta: 35.00 }
      ]
    },
    {
      id: 'dessert-limoncello-cake',
      name: 'Limoncello Mascarpone Layer Cake',
      italianName: 'Torta al Limoncello e Mascarpone',
      category: 'desserts',
      price: 8.95,
      badge: 'Light & Refreshing',
      description: 'Fluffy vanilla sponge cake infused with Sicilian limoncello liqueur, layered with sweet mascarpone frosting and topped with white chocolate curls.',
      image: '/italian-desserts.jpg',
      options: [
        { name: 'Single Generous Slice', priceDelta: 0 }
      ]
    },

    // --- DRINKS & WINES ---
    {
      id: 'drink-aperol-spritz',
      name: 'Classic Venetian Aperol Spritz',
      italianName: 'Aperol Spritz Veneziano',
      category: 'drinks',
      price: 12.00,
      badge: 'Signature Cocktail',
      description: 'Aperol aperitivo, sparkling Italian Prosecco DOC, and a splash of club soda over ice, garnished with an organic orange slice and green olive.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Standard Glass', priceDelta: 0 },
        { name: 'Pitcher for the Table (Serves 4)', priceDelta: 28.00 }
      ]
    },
    {
      id: 'drink-espresso-martini',
      name: 'Italian Dark Espresso Martini',
      italianName: "Martini all'Espresso",
      category: 'drinks',
      price: 13.50,
      badge: 'After Dinner Favorite',
      description: 'Vodka, freshly brewed Italian dark espresso, Kahlúa liqueur, and a dash of simple syrup, shaken vigorously until frothy and crowned with three espresso beans.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Classic Recipe', priceDelta: 0 },
        { name: 'With Baileys Irish Cream Liqueur', priceDelta: 1.50 }
      ]
    },
    {
      id: 'drink-chianti-wine',
      name: 'Tuscan Chianti Classico DOCG (Red Wine)',
      italianName: 'Vino Rosso del Chianti',
      category: 'drinks',
      price: 10.50,
      badge: 'Imported from Tuscany',
      description: 'Dry, balanced red wine with aromas of red cherries, wild herbs, and subtle oak. The quintessential pairing for handmade pasta and red meats.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'By the Glass (6 oz)', priceDelta: 0 },
        { name: 'Half Carafe (500 ml)', priceDelta: 12.00 },
        { name: 'Full Bottle (750 ml)', priceDelta: 25.50 }
      ]
    },
    {
      id: 'drink-san-pellegrino',
      name: 'San Pellegrino Sparkling Natural Mineral Water',
      italianName: 'Acqua Minerale San Pellegrino',
      category: 'drinks',
      price: 4.50,
      badge: 'Imported',
      description: 'Crisp, refreshing Italian mineral water served with fresh lemon or lime slice.',
      image: '/hero-banner.jpg',
      options: [
        { name: 'Large Glass Bottle (750 ml)', priceDelta: 0 }
      ]
    }
  ],
  restaurantInfo: {
    name: "Massoni's Italian Restaurant",
    tagline: 'Authentic Italian Heritage & Modern Comfort Flavors',
    address: '8833 Belair Rd, Nottingham, MD 21236',
    neighborhood: 'Nottingham / Perry Hall, Baltimore County',
    phone: '(410) 970-3700',
    email: 'info@massonisitalian.com',
    owners: 'Nicole Massoni & Chuck Michael',
    toastUrl: 'https://pos.toasttab.com/massonis-italian-restaurant',
    facebookUrl: 'https://www.facebook.com/Massonis-Italian-Restaurant-105128961825355/',
    hours: [
      { day: 'Monday', time: '5:00 PM – 9:00 PM', isOpen: true },
      { day: 'Tuesday', time: '11:00 AM – 9:00 PM', isOpen: true },
      { day: 'Wednesday', time: '11:00 AM – 9:00 PM', isOpen: true },
      { day: 'Thursday', time: '11:00 AM – 9:00 PM', isOpen: true },
      { day: 'Friday', time: '11:00 AM – 10:00 PM', isOpen: true },
      { day: 'Saturday', time: '11:00 AM – 10:00 PM', isOpen: true },
      { day: 'Sunday', time: '11:00 AM – 9:00 PM', isOpen: true }
    ],
    features: [
      { title: 'Signature Spaghetti Eggrolls', desc: 'Our viral Maryland-famous appetizer made fresh daily in house' },
      { title: 'Scratch-Made Ice Cream', desc: 'Ultra-creamy handcrafted Italian gelato and ice cream churned every week' },
      { title: 'Family Hospitality', desc: 'Warm trattoria ambiance dedicated to authentic recipes and friendly service' },
      { title: 'Full Bar & Cocktails', desc: 'Curated Italian wine selection, Aperol Spritz, and craft cocktails' }
    ]
  }
};
