export const dummyRoasts = [
  {
    id: 1,
    timeAgo: "2 mins ago",
    severity: "ABSOLUTE GARBAGE",
    idea: "Tinder, but for matching with potential co-founders based on astrology signs. We use moon phases to determine compatibility and retrograde alerts to warn about bad partnership energy.",
    feasibilityScore: 12,
    feasibilityComment: "Not even a prototype can save this.",
    marketScore: 5,
    marketComment: "Your target audience is literally nobody.",
    originalityScore: 90,
    originalityComment: "Fresh enough. Weird enough. Go.",
    summary: "The stars are aligning to tell you to delete this repository. Mercury is in retrograde and so is your startup career. Burn the pitch deck."
  },
  {
    id: 2,
    timeAgo: "15 mins ago",
    severity: "VIBE NONSENSE",
    idea: "A subscription box for artisanal, blockchain-verified breathing air from different mountain peaks. Each canister is NFT-authenticated and comes with a certificate of altitude origin.",
    feasibilityScore: 40,
    feasibilityComment: "Buildable by a solo dev. Respect.",
    marketScore: 20,
    marketComment: "Niche, but real and underserved.",
    originalityScore: 65,
    originalityComment: "We've seen worse. And better.",
    summary: "You are literally trying to sell thin air. Congratulations on inventing nothing. At least your marketing copy will be breathtaking — pun absolutely intended."
  },
  {
    id: 3,
    timeAgo: "1 hour ago",
    severity: "ACTUALLY... OK?",
    idea: "An AI tool that automatically cancels subscriptions you haven't used in 3 months. It monitors your bank statements and sends you a roast before canceling each one.",
    feasibilityScore: 85,
    feasibilityComment: "Ship it yesterday. Seriously.",
    marketScore: 90,
    marketComment: "Everyone needs this. Everyone.",
    originalityScore: 72,
    originalityComment: "Fresh enough. Weird enough. Go.",
    summary: "Wait, this might actually make money. Don't screw up the execution. We're genuinely surprised — you might be onto something here. Don't let us down."
  }
];

export const mockRoastResponses = [
  {
    verdictBadge: 'ABSOLUTE GARBAGE',
    overallScore: 12,
    roastText: `Look, I get it. You read "Zero to One" and thought you were Peter Thiel. But this idea isn't a monopoly in waiting; it's a black hole for your parents' retirement fund. You are solving a problem that literally zero people have, in a market that is already saturated by free alternatives. The only "disruption" happening here is to your own career trajectory. I strongly recommend you stop coding, touch some grass, and perhaps reconsider your life choices before you end up trying to sell equity to your dog.`,
    feasScore: 15,
    feasNote: "Technically possible. Economically insane.",
    marketScore: 8,
    marketNote: "Your mom and maybe her book club.",
    origScore: 22,
    origNote: "Existed in 2014. Failed then too.",
    badgeColor: 'ember',
    advice: [
      { type: 'PIVOT', text: 'Consider a career in real estate.', color: 'hazard' },
      { type: 'SURVIVE', text: 'Keep your day job. Seriously.', color: 'ember' },
      { type: 'COPE', text: 'Therapy is cheaper than a failed startup.', color: 'acid' }
    ]
  },
  {
    verdictBadge: 'MILD DELUSION',
    overallScore: 34,
    badgeColor: 'hazard',
    roastText: `A crypto-powered toaster. Revolutionary. Why solve real problems when you can burn bread with a blockchain? Zero market, zero logic, 100% chance of a house fire. Your whitepaper is longer than your actual code, and the only thing "decentralized" here is your focus. Stop before you burn the neighborhood down. A crypto-powered toaster. Revolutionary. Why solve real problems when you can burn bread with a blockchain? Zero market, zero logic, 100% chance of a house fire. Your whitepaper is longer than your actual code, and the only thing "decentralized" here is your focus. Stop before you burn the neighborhood down.`,
    feasScore: 45,
    feasNote: "It's just a toaster with a sticker.",
    marketScore: 12,
    marketNote: "Nobody wants NFT toast, Dave.",
    origScore: 55,
    origNote: "Stupid enough to be original.",
    advice: [
      { type: 'PIVOT', text: 'Sell the toaster as a space heater.', color: 'hazard' },
      { type: 'SURVIVE', text: 'Don\'t let it connect to the internet.', color: 'ember' },
      { type: 'COPE', text: 'Bread is better without tokens.', color: 'acid' }
    ]
  },
  {
    verdictBadge: 'ECONOMIC SUICIDE',
    overallScore: 5,
    roastText: `Another 'Uber for X' where X is something that doesn't need an Uber. Have you considered that some things are localized for a reason? Your unit economics are a suicide note. You're bleeding cash on customer acquisition before you even have a customer. The market isn't 'ripe for disruption', it's 'laughing at your pitch deck'. Your technology stack is overkill for a glorified CRUD app, and your marketing strategy is basically 'shouting into the void and hoping someone with more money than sense hears you'. Honestly, the only thing you're disrupting is your own sanity and your investors' portfolios. Go back to your day job and pretend this fever dream never happened. Seriously, just stop. You are solving a problem that literally zero people have, in a market that is already saturated by free alternatives. The only "disruption" happening here is to your own career trajectory. I strongly recommend you stop coding, touch some grass, and perhaps reconsider your life choices before you end up trying to sell equity to your dog. Your burn rate is faster than a California wildfire. The CAC/LTV ratio looks like a vertical line down. Even your co-founder is secretly looking for a job at Google. Just delete the repo and walk away while you still have some dignity left.`,
    feasScore: 5,
    feasNote: "Math says no. Very loud no.",
    marketScore: 3,
    marketNote: "The VCs are already ghosting you.",
    origScore: 2,
    origNote: "Seen this in 2011, 2014, and 2019.",
    badgeColor: 'ember',
    advice: [
      { type: 'PIVOT', text: 'Become a consultant for failure.', color: 'hazard' },
      { type: 'SURVIVE', text: 'Delete the repo. Block your co-founder.', color: 'ember' },
      { type: 'COPE', text: 'It\'s okay to be an employee.', color: 'acid' }
    ]
  },
  {
    verdictBadge: 'WASTE OF BYTES',
    overallScore: 21,
    badgeColor: 'acid',
    roastText: `A social network for plant owners. Because plants really need to see what other plants are doing. It's not a community, it's a graveyard of forgotten notifications. Your monetization plan is as dry as a cactus in the Sahara. You're building features for a user base that doesn't exist, and your 'viral loop' is just spamming people who already regret knowing you. Pivot to a botanical garden or just give up. The world doesn't need another feed of photos that nobody asked for. Also, your leaves are turning yellow, just like this idea. Your push notifications are the equivalent of a fly buzzing in someone's ear at 3 AM. The "gamification" elements you added are just desperate attempts to hide the fact that there's no actual value here. You've spent more time on the landing page than the actual product. Your cloud costs are rising while your retention is dropping to zero. Even the succulents are bored of your UI. Please, for the love of everything green, stop wasting electricity on this. It's time to compost this idea and start fresh.`,
    feasScore: 60,
    feasNote: "Simple to build. Hard to care about.",
    marketScore: 15,
    marketNote: "Cacti don't use smartphones.",
    origScore: 30,
    origNote: "Pinterest already exists.",
    advice: [
      { type: 'PIVOT', text: 'Sell actual plants instead.', color: 'hazard' },
      { type: 'SURVIVE', text: 'Water your plants. Uninstall VS Code.', color: 'ember' },
      { type: 'COPE', text: 'Nature is better than your app.', color: 'acid' }
    ]
  }
];

// For backward compatibility while I update the components
export const mockRoastResult = mockRoastResponses[0];
