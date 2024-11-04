export interface SocialLinkProps {
  platform:
    | "github"
    | "twitter"
    | "mastodon"
    | "linkedin"
    | "instagram"
    | "threads"
    | "facebook"
    | "youtube"
    | "twitch"
    | "tiktok"
    | "snapchat"
    | "reddit"
    | "pinterest"
    | "medium"
    | "dev"
    | "dribbble"
    | "behance"
    | "codepen"
    | "producthunt"
    | "discord"
    | "slack"
    | "whatsapp"
    | "telegram"
    | "email"; // you should always at least have an email
  link: string;
}

export interface SiteDataProps {
  name: String;
  title: string;
  description: string;
  useViewTransitions?: boolean;
  useAnimations?: boolean;
  socialLinks: SocialLinkProps[];
  author: {
    // used for blog post purposes
    name: string;
    email: string;
    twitter: string; // used for twitter cards when sharing a blog post on twitter
  };
  defaultImage: {
    src: string;
    alt: string;
  };
}

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Pablo Galindo Salgado",
  // Your website's title and description (meta fields)
  title:
    "Pablo Galindo Salgado",
  description:
    "Pablo Galindo Salgado's personal website and blog. I write about Python, programming, and other things.",
  useViewTransitions: true,
  useAnimations: true,

  socialLinks: [
    {
      platform: "twitter",
      link: "https://twitter.com/pyblogsal",
    },
    {
      platform: "github",
      link: "https://github.com/pablogsal",
    },
    {
      // you should always at least have an email
      platform: "email",
      link: "mailto:pablogsal@gmail.com",
    },
  ],

  // Your information for blog post purposes
  author: {
    name: "Pablo Galindo",
    email: "pablogsal@gmail.com",
    twitter: "pyblogsal",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/logo.png",
    alt: "Default logo",
  },
};

export default siteData;
