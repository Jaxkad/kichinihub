export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  dietary?: {
    pork?: boolean;
    vegan?: boolean;
    hot?: boolean;
  };
}

export interface MenuSection {
  id: string;
  title: string;
  subtitle?: string;
  theme: 'red' | 'light' | 'brown' | 'green' | 'cream' | 'burgundy' | 'terracotta' | 'teal' | 'slate' | 'forest';
  items: MenuItem[];
}

export interface MenuData {
  sections: MenuSection[];
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
    rsvp: string;
  };
}

export const menuData: MenuData = {
  sections: [
    {
      id: 'starters',
      title: 'Khala pa Khichini',
      subtitle: 'Where would we be without Memories, Khalas greatest hits, now part of the HUBS-STORY',
      theme: 'red',
      items: [
        {
          id: 'tender-beef-ribs-wedges',
          name: 'Tender Beef Ribs & Wedges',
          description: 'Fall-off-the-bone ribs + crispy wedges = a match made in food heaven.',
          price: 40000
        },
        {
          id: 'beer-battered-fish-chips',
          name: 'Beer-Battered Fish & Chips',
          description: 'Crispy, golden, and oh-so-satisfying. Dip it, crunch it, love it!',
          price: 18000
        },
        {
          id: 'tender-goat-ribs-wedges',
          name: 'Tender Goat Ribs & Wedges',
          description: 'Tender, spicy, and packed with flavor. Warning: Highly addictive!',
          price: 23000
        },
        {
          id: 'spicy-chicken-gizzards',
          name: 'Spicy Chicken Gizzards',
          description: 'Sticky, smoky, and finger-lickin\' good. Napkins mandatory!',
          price: 10000,
          dietary: { hot: true }
        },
        {
          id: 'avocado-hummus-wrap',
          name: 'Avocado & Hummus Wrap',
          description: 'Creamy avocado meets smooth hummus in a wrap that\'s fresh, healthy, and totally delicious.',
          price: 15000,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'soups',
      title: 'HUGS IN A BOWL (Soups)',
      subtitle: 'Warm, cozy, and full of love.',
      theme: 'cream',
      items: [
        {
          id: 'butternut-beetroot',
          name: 'Butternut & Beetroot Soup',
          description: 'Creamy, dreamy, and oh-so-comforting. Like a hug in every spoonful.',
          price: 14000,
          dietary: { vegan: true }
        },
        {
          id: 'leek-potato',
          name: 'Leek & Potato Soup',
          description: 'Creamy, hearty, and full of flavor. Comfort food at its best.',
          price: 14000,
          dietary: { vegan: true }
        },
        {
          id: 'carrot-ginger',
          name: 'Carrot Ginger Soup',
          description: 'Sweet carrots + zesty ginger = a bowl of pure happiness.',
          price: 15000,
          dietary: { vegan: true }
        },
        {
          id: 'mushroom',
          name: 'Creamy Mushroom soup',
          description: 'Rich, creamy, and packed with earthy mushroom goodness.',
          price: 15000,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'breakfast',
      title: 'BREAKFAST- "Warm-Up Acts"',
      subtitle: 'Sun\'s up, food\'s ready—let\'s do this!',
      theme: 'light',
      items: [
        {
          id: 'spanish-omlet',
          name: 'Spanish omlet',
          description: 'Fluffy eggs, potatoes, and peppers. A little slice of Spain to start your day.',
          price: 18000
        },
        {
          id: 'bacon-cheese-omellette',
          name: 'Bacon and Cheese omellette',
          description: 'Omellette bliss with crispy bacon and melty cheese. Breakfast just got better!',
          price: 18000,
          dietary: { pork: true }
        },
        {
          id: 'hub-full-omellette',
          name: 'Hub Full omellette',
          description: 'Packed with all your favorite fillings. The ultimate way to start your day.',
          price: 19000
        },
        {
          id: 'full-english-breakfast',
          name: 'Full English Breakfast',
          description: 'All your brekkie faves on one plate. Because why choose when you can have it all?',
          price: 33000,
          dietary: { pork: true }
        },
        {
          id: 'poached-egg-toast',
          name: 'Poached Egg on toast',
          description: 'Simple, satisfying, and always a good idea. Breakfast doesn\'t get better than this.',
          price: 15000
        }
      ]
    },
    {
      id: 'salads',
      title: 'SALADS (GREEN & GREAT)',
      subtitle: 'For when you wanna feel good and eat good.',
      theme: 'green',
      items: [
        {
          id: 'beetroot-feta-butternut',
          name: 'Beetroot, Feta & Butternut Salad',
          description: 'Sweet, salty, and totally Instagram-worthy. Healthy never tasted so good!',
          price: 15000
        },
        {
          id: 'sesame-chicken-avocado',
          name: 'Sesame Chicken & Avocado Salad',
          description: 'Grilled chicken + creamy avocado = a salad you\'ll actually crave.',
          price: 17000
        },
        {
          id: 'steamed-veggie',
          name: 'Steamed Mixed Veggie salad',
          description: 'Fresh, light, and full of goodness. A veggie lover\'s dream.',
          price: 11000,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'finger-foods',
      title: 'FINGER FOODS',
      subtitle: 'Small bites, big flavors!',
      theme: 'teal',
      items: [
        {
          id: 'bbq-wings',
          name: 'BBQ Wings',
          description: 'Sticky, smoky, and finger-lickin\' good. Napkins mandatory!',
          price: 20000
        },
        {
          id: 'chicken-kebab',
          name: 'Chicken Kebab',
          description: 'Tender, juicy, and packed with flavor. Perfect for snacking or sharing.',
          price: 20000
        },
        {
          id: 'beef-kebab',
          name: 'Beef kebab',
          description: 'Savory beef skewers grilled to perfection. A meat lover\'s dream.',
          price: 22000
        },
        {
          id: 'bbq-drumstick',
          name: 'BBQ Drumstick',
          description: 'Juicy, smoky, and totally satisfying. Get your hands on these!',
          price: 20000
        },
        {
          id: 'spicy-meat-balls',
          name: 'Spicy meat balls',
          description: 'Bite-sized, spicy, and full of flavor. Perfect for sharing (or not)!',
          price: 19500,
          dietary: { hot: true }
        },
        {
          id: 'bbq-pork-ribs',
          name: 'BBQ Pork Ribs',
          description: 'Sticky, smoky, and fall-off-the-bone tender. Ribs done right!',
          price: 40000,
          dietary: { pork: true }
        }
      ]
    },
    {
      id: 'mains',
      title: 'MAINS "The Main Event"',
      subtitle: 'For when you\'re serious about eating (and living your best life).',
      theme: 'burgundy',
      items: [
        {
          id: 'large-chambo',
          name: 'Large Chambo',
          description: 'Fresh, flaky, and oh-so-delicious. Choose grilled or fried—you can\'t go wrong!',
          price: 50000
        },
        {
          id: 'jumbo-chambo',
          name: 'Jumbo Chambo',
          description: 'Even bigger, even better. For those who like their fish with a side of wow.',
          price: 60000
        },
        {
          id: 'large-butterfish',
          name: 'Large Butterfish',
          description: 'Buttery, tender, and melt-in-your-mouth good. A seafood lover\'s dream.',
          price: 60000
        },
        {
          id: 'medium-butterfish',
          name: 'Medium Butterfish',
          description: 'All the buttery goodness, just right for a lighter meal.',
          price: 35000
        },
        {
          id: 't-bone-small',
          name: 'T-bone (small)',
          description: 'Perfectly grilled steak, tender and flavorful. A classic choice for meat lovers.',
          price: 35000
        },
        {
          id: 't-bone-large',
          name: 'T-bone (large)',
          description: 'A generous cut of premium steak for the heartiest appetite. Grilled to perfection.',
          price: 40000
        },
        {
          id: 'pork-chop',
          name: 'Pork chop',
          description: 'Juicy, tender pork chop seasoned and grilled to perfection. A savory delight!',
          price: 35000,
          dietary: { pork: true }
        },
        {
          id: 'quarter-chicken',
          name: 'Quarter chicken',
          description: 'Tender quarter chicken, perfectly seasoned and cooked. Simple, satisfying, delicious.',
          price: 25000
        },
        {
          id: 'hub-chicken-burger',
          name: 'Hub styled chicken Burger',
          description: 'Juicy chicken, fresh toppings, and a secret sauce that\'ll have you coming back for more.',
          price: 22000
        },
        {
          id: 'hub-beef-burger',
          name: 'Hub styled Beef Burger',
          description: 'A beefy classic done right. Juicy, flavorful, and totally satisfying.',
          price: 25000
        },
        {
          id: 'jamaican-jerk-chicken',
          name: 'Jamaican Jerk Chicken',
          description: 'Spiced, grilled, and full of island vibes. Taste the Caribbean in every bite!',
          price: 35000
        },
        {
          id: 'flank-steak',
          name: 'Flank steak',
          description: 'Tender, juicy, and packed with flavor. A steak lover\'s delight.',
          price: 28500
        },
        {
          id: 'beef-stir-fry',
          name: 'Beef stir fry',
          description: 'Sizzling beef, fresh veggies, and a savory sauce. Stir-fried to perfection.',
          price: 25000
        },
        {
          id: 'chicken-stir-fry',
          name: 'Chicken stir Fry',
          description: 'Tender chicken, crisp veggies, and a flavorful sauce. Stir-fried just for you.',
          price: 23000
        }
      ]
    },
    {
      id: 'sandwiches',
      title: 'HAND-HELD HAPPINESS (Sandwiches)',
      subtitle: 'Grab, go, and get happy!',
      theme: 'slate',
      items: [
        {
          id: 'bacon-cheese-sandwich',
          name: 'Bacon and Cheese',
          description: 'Crispy bacon + melty cheese = a sandwich that\'s pure happiness.',
          price: 19000,
          dietary: { pork: true }
        },
        {
          id: 'egg-mayo-sandwich',
          name: 'Egg and Mayo',
          description: 'Creamy, dreamy, and totally satisfying. A classic done right.',
          price: 16500
        },
        {
          id: 'chicken-mayo-sandwich',
          name: 'Chicken Mayo',
          description: 'Tender chicken, creamy mayo, and fresh veggies. Simple, but oh-so-good.',
          price: 20000
        },
        {
          id: 'chicken-cheese-sandwich',
          name: 'Chicken and cheese',
          description: 'Juicy chicken + melty cheese = a match made in sandwich heaven.',
          price: 18500
        },
        {
          id: 'tomato-cheese-sandwich',
          name: 'Tomato and cheese',
          description: 'Fresh tomatoes + gooey cheese. Simple, fresh, and totally delicious.',
          price: 15000
        },
        {
          id: 'tomato-onion-sandwich',
          name: 'Tomato and Onion',
          description: 'A veggie delight with fresh tomatoes and zesty onions. Light and tasty!',
          price: 14000,
          dietary: { vegan: true }
        },
        {
          id: 'fish-rocket',
          name: 'Fish on bed of Rocket',
          description: 'Flaky fish meets peppery rocket. A sandwich that\'s fresh and flavorful.',
          price: 22000
        },
        {
          id: 'steak-rocket',
          name: 'Steak on bed of Rocket',
          description: 'Juicy steak + fresh rocket = a sandwich that\'s bold and satisfying.',
          price: 21000
        },
        {
          id: 'steak-sandwich',
          name: 'Steak sandwich',
          description: 'Tender steak, fresh toppings, and a soft bun. A sandwich that\'s pure perfection.',
          price: 18000
        }
      ]
    },
    {
      id: 'wraps',
      title: 'WRAPS',
      subtitle: 'Grab, go, and get happy!',
      theme: 'forest',
      items: [
        {
          id: 'chicken-chapati',
          name: 'Chicken Chapati',
          description: 'Tender chicken wrapped in soft chapati. Simple, fresh, and totally delicious.',
          price: 20000
        },
        {
          id: 'chicken-shawarma',
          name: 'Chicken shawarma',
          description: 'Spiced chicken, fresh veggies, and a creamy garlic sauce. Wrapped up just for you!',
          price: 22000
        },
        {
          id: 'shawarma-chips',
          name: 'Shawarma & chips',
          description: 'Flavorful shawarma served with crispy chips. A perfect combo of savory and satisfying!',
          price: 20000
        },
        {
          id: 'spicy-beef-wrap',
          name: 'Spicy beef wrap',
          description: 'Beef so good, it\'ll make you wanna dance. Spicy, saucy, and totally satisfying.',
          price: 22000,
          dietary: { hot: true }
        },
        {
          id: 'mixed-veggie-wrap',
          name: 'Mixed Veggie wrap',
          description: 'A veggie-packed wrap that\'s fresh, healthy, and full of flavor.',
          price: 20000,
          dietary: { vegan: true }
        },
        {
          id: 'fish-shawarma',
          name: 'Fish shawarma',
          description: 'Flaky fish, fresh veggies, and a tangy sauce. A seafood twist on a classic.',
          price: 14000
        }
      ]
    },
    {
      id: 'starches',
      title: 'Sidekick Spectacular (Starches)',
      subtitle: 'Because every hero needs a sidekick!',
      theme: 'brown',
      items: [
        {
          id: 'potato-fries',
          name: 'Potato fries',
          description: 'Golden, crispy, and totally irresistible. The ultimate sidekick.',
          price: 8000,
          dietary: { vegan: true }
        },
        {
          id: 'yellow-rice',
          name: 'Yellow rice',
          description: 'Fluffy, fragrant, and full of flavor. The perfect side for any dish.',
          price: 7000,
          dietary: { vegan: true }
        },
        {
          id: 'homemade-nsima',
          name: 'Homemade nsima',
          description: 'A traditional favorite, soft, hearty, and oh-so-comforting.',
          price: 5000,
          dietary: { vegan: true }
        },
        {
          id: 'rosemary-garlic-potato',
          name: 'Rosemary Garlic Potato',
          description: 'Crispy on the outside, fluffy on the inside, and packed with flavor.',
          price: 10000,
          dietary: { vegan: true }
        },
        {
          id: 'wedges',
          name: 'Wedges',
          description: 'Thick, crispy, and totally satisfying. The perfect side for any meal.',
          price: 10000,
          dietary: { vegan: true }
        },
        {
          id: 'fried-plantains',
          name: 'Fried Plantains',
          description: 'Sweet, caramelized, and downright delicious. A tropical twist on fries!',
          price: 8000,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'mediterranean',
      title: 'Mediterranean Delights',
      subtitle: 'Fresh, vibrant, and full of flavor—straight from the Mediterranean to your plate!',
      theme: 'forest',
      items: [
        {
          id: 'falafel-wrap',
          name: 'Falafel Wrap',
          description: 'Crispy falafel, fresh veggies, and creamy tahini wrapped in a soft chapati. A handheld taste of the Mediterranean!',
          price: 15500
        },
        {
          id: 'mediterranean-bowl',
          name: 'Mediterranean Bowl',
          description: 'A flavor-packed bowl of sunshine! Fluffy couscous, crispy falafel, fresh veggies, and a drizzle of tahini.',
          price: 14500
        },
        {
          id: 'tabbouleh',
          name: 'Tabbouleh',
          description: 'Fresh parsley, juicy tomatoes, zesty onions, and a hint of mint—light, refreshing, and oh-so-delicious!',
          price: 8500
        },
        {
          id: 'baba-ganoush',
          name: 'Baba Ganoush',
          description: 'Smoky, creamy, and totally addictive! Roasted eggplant blended with tahini, garlic, and lemon.',
          price: 12500
        },
        {
          id: 'hummus',
          name: 'Hummus',
          description: 'Smooth, creamy, and oh-so-satisfying! Classic hummus made with chickpeas, tahini, and a touch of garlic.',
          price: 9500
        }
      ]
    },
    {
      id: 'platters',
      title: 'PLATTERS (SHARING IS CARING)',
      subtitle: 'A little bit of everything you love! Perfect for sharing (or keeping all to yourself—we won\'t judge). Includes a selection of our most popular bites, from crispy starters to savory mains. Great for small gatherings or big appetites!',
      theme: 'terracotta',
      items: [
        {
          id: 'falafel-platter',
          name: 'Falafel Platter',
          description: 'Crispy falafel, fresh veggies, and warm pita. Perfect for sharing (or not—we won\'t judge).',
          price: 45000
        },
        {
          id: 'mezze-platter',
          name: 'Mezze Platter',
          description: 'A Mediterranean feast for the table. Samosas, hummus, baba ganoush, and more—dig in!',
          price: 105000
        },
        {
          id: 'medium-hub-platter',
          name: 'MediumHub- Platter',
          description: '"The Mix & Match Platter" includes BBQ wings, spicy chicken gizzards, potato fries & beef kebabs',
          price: 80000
        },
        {
          id: 'big-hub-platter',
          name: 'Big-Hub-Platter',
          description: '"The Feast Master Platter" includes Tender beef ribs, BBQ pork ribs, chicken shawarma, fried plantain, Wedges & Beef Strips',
          price: 120000
        }
      ]
    },
    {
      id: 'extra',
      title: 'EXTRA (Because Why Not?)',
      theme: 'red',
      items: [
        {
          id: 'eggs-large',
          name: 'Eggs',
          description: 'Fresh eggs cooked just the way you like them. A perfect addition to any meal!',
          price: 7000
        },
        {
          id: 'cheese',
          name: 'Cheese',
          description: 'Melted, grated, or sliced - add that cheesy goodness to any dish!',
          price: 5000
        },
        {
          id: 'plantain-large',
          name: 'Plantain',
          description: 'Generous portion of sweet, caramelized plantains. The perfect tropical side!',
          price: 8500,
          dietary: { vegan: true }
        },
        {
          id: 'bacon',
          name: 'Bacon',
          description: 'Because everything\'s better with bacon. Period.',
          price: 3000,
          dietary: { pork: true }
        },
        {
          id: 'hub-lunch-box',
          name: 'The Hub-Lunch Box',
          description: 'Convinience in a box,flavour in every bite',
          price: 1000
        }
      ]
    }
  ],
  social: {
    instagram: '@khichini_hub',
    facebook: '@KhichiniHub',
    twitter: '@khichini_hub',
    tiktok: 'Khichinievents',
    rsvp: '+265997000015'
  }
};
