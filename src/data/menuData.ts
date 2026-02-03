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
  theme: 'red' | 'light' | 'brown' | 'green' | 'cream' | 'burgundy' | 'terracotta' | 'teal' | 'slate' | 'forest' | 'golden' | 'burnt' | 'sage' | 'earth' | 'leaf' | 'olive';
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
      id: 'breakfast',
      title: 'BREAKFAST (WARM-UP ACTS)',
      subtitle: "Sun's up, Food's ready Lets Do This",
      theme: 'golden',
      items: [
        {
          id: 'spanish-omelette',
          name: 'Spanish Omelette',
          description: 'Made with fresh veggies and herbs.',
          price: 17500
        },
        {
          id: 'bacon-cheese-omelette',
          name: 'Bacon and Cheese Omelette',
          description: 'Bacon, cheddar cheese & fluffy eggs.',
          price: 18500,
          dietary: { pork: true }
        },
        {
          id: 'hub-full-omelette',
          name: 'Hub Full Omelette',
          description: 'Packed with mushrooms, bacon, green pepper & cheddar cheese.',
          price: 19500,
          dietary: { pork: true }
        },
        {
          id: 'full-english-breakfast',
          name: 'Full English Breakfast',
          description: 'Sausages, beans, toast, mushrooms, bacon & eggs. Only whose anthem we know get why this is the real breakfast.',
          price: 25000,
          dietary: { pork: true }
        },
        {
          id: 'poached-egg-toast',
          name: 'Poached Egg on Toast',
          description: 'Fresh eggs poached and served on toasted bread. Doesn\'t get better than this.',
          price: 15500
        }
      ]
    },
    {
      id: 'salads',
      title: 'SALADS (GREEN & GREAT)',
      subtitle: 'FOR WHEN YOU WANNA FEEL GOOD AND EAT GOOD.',
      theme: 'leaf',
      items: [
        {
          id: 'beetroot-feta-butternut',
          name: 'Beetroot, Feta & Butternut Salad',
          description: 'Sweet, salty and totally Instagram-worthy. Healthy never tasted so good.',
          price: 18500,
          dietary: { vegan: false }
        },
        {
          id: 'sesame-chicken-avocado',
          name: 'Sesame Chicken & Avocado Salad',
          description: 'Grilled chicken in creamy avocado & sesame. A salad you\'ll actually crave!',
          price: 21000
        },
        {
          id: 'steamed-veggie',
          name: 'Steamed Mixed Veggie Salad',
          description: 'The veggie side of champions. A veggie fix from a winner.',
          price: 16500,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'soups',
      title: 'Hugs in a Bowl (Soups)',
      subtitle: 'WARM, COZY, AND FULL OF LOVE.',
      theme: 'earth',
      items: [
        {
          id: 'butternut-beetroot',
          name: 'Butternut & Beetroot Soup',
          description: 'A sweet and savory blend. Comfort in a cup.',
          price: 16500,
          dietary: { vegan: true }
        },
        {
          id: 'leek-potato',
          name: 'Leek & Potato Soup',
          description: 'Creamy, rich and soul-hugging. You\'ll want to sip it slowly.',
          price: 17000,
          dietary: { vegan: true }
        },
        {
          id: 'carrot-ginger',
          name: 'Carrot Ginger Soup',
          description: 'Zesty, bright & full of veggie happiness.',
          price: 16500,
          dietary: { vegan: true }
        },
        {
          id: 'mushroom',
          name: 'Creamy Mushroom Soup',
          description: 'Rich and packed with earthy mushroom goodness.',
          price: 15000,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'finger-foods',
      title: 'Finger Foods',
      subtitle: 'SMALL BITES, BIG FLAVORS!',
      theme: 'burnt',
      items: [
        {
          id: 'bbq-wings',
          name: 'BBQ Wings',
          description: 'Sticky, smoky, and finger-lickin\' good. Napkins mandatory!',
          price: 18500,
          dietary: { hot: true }
        },
        {
          id: 'beef-kebab',
          name: 'Beef Kebab',
          description: 'Savory beef skewers grilled to perfection. A meat lover\'s dream.',
          price: 18000
        },
        {
          id: 'bbq-drumstick',
          name: 'BBQ Drumstick',
          description: 'Juicy, smoky, and totally satisfying. Get your hands on these!',
          price: 19500
        },
        {
          id: 'spicy-meatballs',
          name: 'Spicy Meat Balls',
          description: 'Bite-sized, spicy, and full of flavor. Perfect for sharing (or not)!',
          price: 19500,
          dietary: { hot: true }
        },
        {
          id: 'bbq-pork-ribs',
          name: 'BBQ Pork Ribs',
          description: 'Sticky, smoky, and fall-off-the-bone tender. Ribs done right!',
          price: 33000,
          dietary: { pork: true }
        }
      ]
    },
    {
      id: 'mediterranean',
      title: 'MEDITERRANEAN DELIGHTS',
      subtitle: 'FRESH, VIBRANT, AND FULL OF FLAVOR - STRAIGHT FROM THE MED KITCHEN TO YOUR PLATE!',
      theme: 'olive',
      items: [
        {
          id: 'falafel-wrap',
          name: 'Falafel Wrap',
          description: 'Crispy falafel, fresh veggies, and creamy tahini wrapped in a soft chapati. A handheld taste of the Mediterranean!',
          price: 23500,
          dietary: { vegan: true }
        },
        {
          id: 'mediterranean-bowl',
          name: 'Mediterranean Bowl',
          description: 'A flavor-packed bowl of sunshine! Fluffy couscous, crispy falafel, fresh veggies, and a drizzle of tahini.',
          price: 35000,
          dietary: { vegan: true }
        },
        {
          id: 'tabbouleh',
          name: 'Tabbouleh',
          description: 'Fresh parsley, juicy tomatoes, zesty onions, and a hint of mint—light, refreshing, and oh-so-delicious!',
          price: 12500,
          dietary: { vegan: true }
        },
        {
          id: 'baba-ganoush',
          name: 'Baba Ganoush',
          description: 'Smoky, creamy, and totally addictive! Roasted eggplant blended with tahini, garlic, and lemon.',
          price: 14500,
          dietary: { vegan: true }
        },
        {
          id: 'hummus',
          name: 'Hummus',
          description: 'Smooth, creamy, and oh-so-satisfying! Classic hummus made with chickpeas, tahini, and a touch of garlic.',
          price: 12000,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'mains',
      title: 'Mains (The Main Event)',
      theme: 'burgundy',
      items: [
        {
          id: 'large-chambo',
          name: 'Large Chambo (Grilled)',
          description: 'Go big, don\'t stop at delicious. Choose grilled or fried — you can\'t go wrong.',
          price: 30000
        },
        {
          id: 'jumbo-chambo',
          name: 'Jumbo Chambo',
          description: 'Two whole fish, perfect for the fearless with a side of wedges or salad.',
          price: 35000
        },
        {
          id: 'large-butterfish',
          name: 'Large Butterfish',
          description: 'Thick buttery fish — grilled to melt-in-your-mouth good. A seafood lover\'s win.',
          price: 30000
        },
        {
          id: 'medium-butterfish',
          name: 'Medium Butterfish',
          description: 'When you want the butterfish magic in a lighter fit meal.',
          price: 23000
        },
        {
          id: 'hub-chicken-burger',
          name: 'Hub Styled Chicken Burger',
          description: 'Juicy chicken, fresh toppings, and a secret sauce that\'ll have you coming back for more.',
          price: 23500
        },
        {
          id: 'hub-beef-burger',
          name: 'Hub Styled Beef Burger',
          description: 'A beefy tower of flavor, juicy, savory, flavorful, and totally satisfying.',
          price: 24500
        },
        {
          id: 'quarter-chicken',
          name: 'Quarter Chicken',
          description: 'Homey, juicy and perfectly seasoned. A quarter of deliciousness!',
          price: 18500
        },
        {
          id: 'jerk-chicken',
          name: 'Jamaican Jerk Chicken',
          description: 'Spiced, grilled and full of island vibes. Taste the Caribbean in every bite.',
          price: 25000,
          dietary: { hot: true }
        },
        {
          id: 'pork-chops',
          name: 'Pork Chops',
          description: 'Juicy, flavorful, and grilled to perfection. Pork done right!',
          price: 25000,
          dietary: { pork: true }
        },
        {
          id: 'flank-steak',
          name: 'Flank Steak',
          description: 'Marinated, grilled, and very rare! A steak lover\'s delight.',
          price: 29000
        },
        {
          id: 't-bone-steak',
          name: 'Large T-Bone Steak',
          description: 'For the real meat fans. For those who take their steak with a side of pride.',
          price: 28000
        },
        {
          id: 'beef-stir-fry',
          name: 'Beef Stir Fry',
          description: 'Sizzling beef, fresh veggies and a savory sauce. Stir-fried to perfection.',
          price: 19500
        },
        {
          id: 'chicken-stir-fry',
          name: 'Chicken Stir Fry',
          description: 'Tender chicken, crisp veggies, and sweet-sour stir-fried just for you.',
          price: 18500
        }
      ]
    },
    {
      id: 'platters',
      title: 'PLATTERS (SHARING IS CARING)',
      subtitle: 'A LITTLE BIT OF EVERYTHING YOU LOVE! PERFECT FOR SHARING (OR NOT).',
      theme: 'olive',
      items: [
        {
          id: 'falafel-platter',
          name: 'Falafel Platter',
          description: 'Crispy falafel, fresh veggies, and warm pita. Perfect for sharing (or not—we won\'t judge)',
          price: 55000,
          dietary: { vegan: true }
        },
        {
          id: 'mezza-platter',
          name: 'Mezza Platter',
          description: 'Mediterranean bites made for the table. Samosas, hummus, baba ganoush, pita and veg.',
          price: 125000,
          dietary: { vegan: true }
        },
        {
          id: 'medium-hub-platter',
          name: 'MediumHub + Platter',
          description: 'Mixed meat platter: Includes BBQ wings, sticky BBQ gizzards, chicken pieces & fries.',
          price: 120000
        },
        {
          id: 'big-hub-platter',
          name: 'Big-Hub + Platter',
          description: 'Mega platter with BBQ wings, sticky BBQ beef ribs, BBQ pork chops, chicken stir fry, samosas, beef kebabs, pita & fries.',
          price: 180000,
          dietary: { pork: true }
        }
      ]
    },
    {
      id: 'sandwiches',
      title: 'Hand-Held Happiness (Sandwiches)',
      subtitle: 'GRAB, GO, AND GET HAPPY!',
      theme: 'sage',
      items: [
        {
          id: 'bacon-cheese-sandwich',
          name: 'Bacon & Cheese Sandwich',
          description: 'Bacon meets cheddar in this sandwich that puts happiness first.',
          price: 19500,
          dietary: { pork: true }
        },
        {
          id: 'egg-mayo-sandwich',
          name: 'Egg and Mayo Sandwich',
          description: 'Creamy, dreamy and totally satisfying. A classic done right.',
          price: 14500
        },
        {
          id: 'chicken-mayo-sandwich',
          name: 'Chicken Mayo Sandwich',
          description: 'Juicy chicken mayo, served with fresh veggies. Simple, but not basic.',
          price: 18500
        },
        {
          id: 'chicken-cheese-sandwich',
          name: 'Chicken and Cheese Sandwich',
          description: 'Chicken strips meet cheese in a match made in sandwich heaven.',
          price: 18500
        },
        {
          id: 'tomato-cheese-sandwich',
          name: 'Tomato and Cheese Sandwich',
          description: 'Tomatoes + cheddar = the ultimate morning fix or not!',
          price: 15000
        },
        {
          id: 'tomato-onion-sandwich',
          name: 'Tomato and Onion Sandwich',
          description: 'A veggie sandwich with fresh tomato and zesty onions. Light and feel-good.',
          price: 14000,
          dietary: { vegan: true }
        },
        {
          id: 'fish-rocket',
          name: 'Fish on Bed of Rocket',
          description: 'Flaky fish meets peppery rocket. A sandwich that\'s fresh and flavorful.',
          price: 22000
        },
        {
          id: 'steak-rocket',
          name: 'Steak on Bed of Rocket',
          description: 'Steak strips + rocket = a combo for every bite win!',
          price: 21000
        },
        {
          id: 'steak-sandwich',
          name: 'Steak Sandwich',
          description: 'Juicy steak in fresh bread with soft bun & sandwich sauces of choice.',
          price: 18500
        }
      ]
    },
    {
      id: 'wraps',
      title: 'Wraps',
      subtitle: 'GRAB, GO AND GET HAPPY!',
      theme: 'sage',
      items: [
        {
          id: 'chicken-chapati',
          name: 'Chicken Chapati',
          description: 'Chapati wrap filled with spiced chicken. Simple, fresh and tasty. A full meal!',
          price: 17500
        },
        {
          id: 'chicken-shawarma',
          name: 'Chicken Shawarma',
          description: 'Juicy grilled chicken, wrapped in a creamy garlic sauce. Wrapped up & rolled out for you!',
          price: 18500
        },
        {
          id: 'spicy-beef-wrap',
          name: 'Spicy Beef Wrap',
          description: 'Grilled beef strips with some dance. Spicy, savory & filling.',
          price: 18500,
          dietary: { hot: true }
        },
        {
          id: 'mixed-veggie-wrap',
          name: 'Mixed Veggie Wrap',
          description: 'Hummus, grilled veggies & herb salad. So much flavor!',
          price: 16500,
          dietary: { vegan: true }
        },
        {
          id: 'fish-shawarma',
          name: 'Fish Shawarma',
          description: 'Flaky fish, fresh veggies, and a tangy sauce. A seafood twist on a classic.',
          price: 20500
        }
      ]
    },
    {
      id: 'starches',
      title: 'SIDEKICK SPECTACULAR (STARCHES)',
      subtitle: 'BECAUSE EVERY HERO NEEDS A SIDEKICK!',
      theme: 'brown',
      items: [
        {
          id: 'potato-fries',
          name: 'Potato Fries',
          description: 'Crispy, crispy and totally addictive. Sometimes sidekick, always a hero.',
          price: 6000,
          dietary: { vegan: true }
        },
        {
          id: 'yellow-rice',
          name: 'Yellow Rice',
          description: 'Fluffy, fragrant, and full of fun. The perfect side for any dish.',
          price: 8000,
          dietary: { vegan: true }
        },
        {
          id: 'homemade-nsima',
          name: 'Homemade Nsima',
          description: 'A traditional favorite, soft, hearty, and oh-so-comforting.',
          price: 3000,
          dietary: { vegan: true }
        },
        {
          id: 'rosemary-garlic-potato',
          name: 'Rosemary Garlic Potato',
          description: 'Crispy on the outside, fluffy on the inside, and packed with flavor.',
          price: 6000,
          dietary: { vegan: true }
        },
        {
          id: 'wedges',
          name: 'Wedges',
          description: 'Thick, crispy, and totally satisfying. The perfect side for any meal.',
          price: 8000,
          dietary: { vegan: true }
        },
        {
          id: 'fried-plantains',
          name: 'Fried Plantains',
          description: 'Sweet, caramelized and downright delicious. A tropical twist on fries!',
          price: 7500,
          dietary: { vegan: true }
        }
      ]
    },
    {
      id: 'extra',
      title: 'EXTRA',
      subtitle: 'BECAUSE WHY NOT?',
      theme: 'golden',
      items: [
        {
          id: 'egg',
          name: 'Egg',
          description: 'Because everything\'s better with an egg on top!',
          price: 3000
        },
        {
          id: 'plantain',
          name: 'Plantain',
          description: 'Sweet, caramelized and downright delicious. A tropical treat.',
          price: 7500,
          dietary: { vegan: true }
        },
        {
          id: 'bacon',
          name: 'Bacon',
          description: 'Because everything\'s better with bacon. Period.',
          price: 8500,
          dietary: { pork: true }
        },
        {
          id: 'cheese',
          name: 'Cheese',
          description: 'Melty, gooey and always a good idea. Add it to anything!',
          price: 7500,
          dietary: { vegan: false }
        },
        {
          id: 'hub-lunch-box',
          name: 'The Hub-Lunch Box',
          description: 'Convenience in a box, flavour in every bite',
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
