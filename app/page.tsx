"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import FloatingMessages from "@/components/FloatingMessages";
import VoicesOfTruthBanner from "@/components/VoicesOfTruthBanner";
import NaksaBanner from "@/components/NaksaBanner";
import { useAuth } from "@/context/AuthContext";
import { getPosts } from "@/services/api";

type ApiUser = { name?: string; email?: string };
type FeedPost = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt?: string;
  createdBy?: ApiUser | string | null;
};

function formatPostDate(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function authorLabel(createdBy: FeedPost["createdBy"]) {
  if (createdBy && typeof createdBy === "object" && "name" in createdBy && createdBy.name) {
    return createdBy.name;
  }
  return "Voices of Truth";
}

// Historical facts with period imagery
const historyFacts = [
  {
    year: "1917",
    title: "The Balfour Declaration",
    content: "1917 marked a turning point in the region's history. British promise of a homeland for Jews in Palestine, ignoring the indigenous Palestinian population.",
    image: "https://images.routledge.com/common/jackets/crclarge/978071043/9780710430342.jpg"
  },
  {
    year: "1948",
    title: "The Nakba",
    content: "Millions were uprooted, but the memory remains alive. Over 750,000 Palestinians forcibly expelled from their homes. More than 500 villages destroyed.",
    image: "https://www.prc.ps/uc_files/image/resize/800/450/app_files/custom-fields/image/nkbjpg_17473037761342398912220.jpg?vsig=56f3bc76a8a57c57d3940e8bc3847932"
  },
  {
    year: "1967",
    title: "The Naksa",
    content: "1967 changed the course of Palestinian lives forever. Israel occupied the West Bank, Gaza Strip, and East Jerusalem. Another wave of displacement.",
    image: "https://www.petra.gov.jo/upload/1685887655395.jfif"
  },
  {
    year: "Present",
    title: "The Resistance Continues",
    content: "Despite 75+ years of occupation, Palestinians continue to resist and demand their right to return. The struggle for justice, freedom, and self-determination persists through generations.",
    image: "https://pbs.twimg.com/media/DNpmukjWAAo6ECd.jpg"
  }
];

// Key facts with powerful imagery
const keyFacts = [
  { 
    text: "Palestine has been inhabited for over 3,000 years", 
    icon: "🏛️",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Frontispiece_of_Adriaan_Reland%27s_Palaestina_ex_monumentis_veteribus_illustrata.jpg",
    caption: "Palestine's roots run deeper than most civilizations."
  },
  { 
    text: "Palestinians hold the keys to 7 million homes they were expelled from", 
    icon: "🔑",
    image: "https://cdn.shopify.com/s/files/1/1559/8623/products/PalestinianReturnKey-PalestineinaBox-401836_550x.jpg?v=1646263219",
    caption: "Every key tells a story of loss and hope."
  },
  { 
    text: "Jerusalem (Al-Quds) has been a Muslim and Christian holy city for centuries", 
    icon: "🕌",
    image: "https://alkhanadeq.com/static/media/pics/1500x850/971a17e9f0eeb51bd5e94202148a6e361743064796.jpg",
    caption: "A city sacred for centuries, standing through time."
  },
  { 
    text: "The apartheid wall steals more Palestinian land every day", 
    icon: "🧱",
    image: "https://garnet.elliott.gwu.edu/files/2023/10/Chris1-071-1024x768.jpg",
    caption: "The wall divides more than land; it divides lives."
  },
  { 
    text: "Gaza has been under siege for over 16 years", 
    icon: "🕊️",
    image: "https://cdn.vectorstock.com/i/500p/21/37/gaza-flag-concept-text-amp-palestine-vector-49322137.jpg",
    caption: "16 years of siege, yet the spirit remains unbroken."
  },
  { 
    text: "Over 5 million Palestinians live as refugees in neighboring countries", 
    icon: "🌍",
    image: "https://ichef.bbci.co.uk/news/480/cpsprodpb/0ac0/live/effbb670-6d1f-11f0-a833-a93f3b53dff8.jpg.webp",
    caption: "Millions displaced, but their identity endures."
  }
];

// Heroes of the Palestinian cause
const people = [
  {
    name: "Mostafa Rashidi",
    avatar: "/avatars/Mostafa-Rashidi.png",
    description: "Date of Birth: 1-12-1959\nDate of Passing: 9-3-2026\n\nPerhaps this man was never mentioned in history books,\nand no stories were ever written about him in Palestine…\nBut he left a mark on my heart that will never fade,\na mark that became the reason behind every step I take today.\n\nOut of love for this man…\nI built this place and wrote all this code,\nnot only to document the truth…\nbut to keep his name alive among people,\nand to gather as many prayers for him as possible.\n\nThis is my father… who has passed away.\nI kindly ask you to pray for him.\n\nMay Allah have mercy on you, my father.\nYou never fell short, and you never gave up on me…\nYou did more than enough for me to stand today and continue the journey.\n\nI love you… goodbye until I meet you again"
  },
  {
    name: "Yasser Arafat",
    avatar: "/avatars/yasser-arafat.jpg",
    description: "Born in 1929, Yasser Arafat was the founder of Fatah and long-serving Chairman of the Palestine Liberation Organization (PLO). He dedicated his life to the Palestinian cause, leading armed resistance and later pursuing diplomacy. In 1993 he signed the Oslo Accords and was awarded the Nobel Peace Prize in 1994 alongside Rabin and Peres. He served as the first President of the Palestinian Authority until his death in 2004. To millions, he remains the enduring face of Palestinian national identity."
  },
  {
    name: "Leila Khaled",
    avatar: "/avatars/leila-khaled.jpg",
    description: "Born in Haifa in 1944, Leila Khaled was expelled with her family during the Nakba at the age of four. She joined the Popular Front for the Liberation of Palestine (PFLP) and became internationally known for her role in two aircraft hijackings in 1969 and 1970. Her image — keffiyeh-draped, rifle in hand — became one of the most iconic symbols of Palestinian resistance and women's liberation. She remains an active political figure and a powerful voice for Palestinian rights to this day."
  },
  {
    name: "Ghassan Kanafani",
    avatar: "/avatars/ghassan-kanafani.jpg",
    description: "Born in Acre in 1936, Ghassan Kanafani was a novelist, journalist, and leading member of the PFLP. Displaced during the Nakba, he channeled the pain of exile into literature that spoke for an entire people. His most celebrated works — Men in the Sun and Return to Haifa — are landmarks of Arabic literature that explore displacement, loss, and the Palestinian right of return. He also edited the militant newspaper Al-Hadaf. He was assassinated by a Mossad car bomb in Beirut in 1972 at the age of 36, but his words live on."
  },
  {
    name: "Saleh Al-Jafarawi",
    avatar: "/avatars/saleh-aljafarawi.png",
    description: "Saleh Al-Jafarawi is a senior commander of the Izz ad-Din al-Qassam Brigades and one of the most prominent military figures in Gaza. Known for his deep tactical expertise and years of service to the Palestinian resistance, he has played a key role in planning and executing operations against the occupation. He represents a generation of Palestinian fighters who grew up under siege and chose to dedicate their lives to defending their people and their land."
  },
  {
    name: "Abou Oubaida",
    avatar: "/avatars/abou-oubaida.jpg",
    description: "Abu Ubaida is the official spokesman of the Izz ad-Din al-Qassam Brigades, the military wing of Hamas. Known for his masked appearances and composed delivery, he became the most recognized military voice coming out of Gaza during the 2023–2024 war. His statements — broadcast to millions worldwide — reported operations, addressed the enemy, and rallied a besieged population. To many Palestinians and supporters around the world, he symbolizes steadfastness and the unyielding spirit of Gaza under relentless bombardment."
  }
];

// Modern context / current events
const currentEvents = [
  {
    title: "Palestinian Rally for Justice",
    content: "Voices raised in unity, demanding justice and freedom. The struggle continues in the streets, in protests, and in every heart that beats for Palestine.",
    image: "https://www.mobtada.com/resize?src=uploads/images/2024/05/17157840920.png&w=750&h=450&zc=0&q=70"
  }
];

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPostsLoading(true);
      setPostsError(null);
      try {
        const res = await getPosts({ page: 1, limit: 20 });
        const list = Array.isArray(res?.data) ? res.data : [];
        if (!cancelled) setFeedPosts(list);
      } catch {
        if (!cancelled) {
          setPostsError("Could not load posts. Is the API running?");
          setFeedPosts([]);
        }
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="home-container">
      <FloatingMessages />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-red">Truth</span> cannot be erased.
            <br />
            <span className="text-green">Palestine</span> cannot be forgotten.
          </h1>
          <p className="hero-subtitle">
            Every inch of this land carries history, identity, and a truth that refuses silence.
          </p>
          {isLoggedIn && user && (
            <p className="hero-welcome">Welcome back, {user.name}</p>
          )}
        </div>
      </section>

      {/* Posts Section */}
      <section className="posts-section">
        <div className="section-header">
          <span className="section-line"></span>
          <h2 className="section-title">Voices of Truth</h2>
          <span className="section-line"></span>
        </div>
        <div className="posts-grid">
          {postsLoading && (
            <p className="posts-loading" style={{ gridColumn: "1 / -1", textAlign: "center", opacity: 0.85 }}>
              Loading voices…
            </p>
          )}
          {!postsLoading && postsError && (
            <p className="posts-error" style={{ gridColumn: "1 / -1", textAlign: "center", opacity: 0.85 }}>
              {postsError}
            </p>
          )}
          {!postsLoading && !postsError && feedPosts.length === 0 && (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", opacity: 0.85 }}>
              No posts yet. Run the seed script on the backend to add starter content.
            </p>
          )}
          {!postsLoading &&
            !postsError &&
            feedPosts.map((post, index) => (
              <PostCard
                key={post._id}
                title={post.title}
                content={post.content}
                author={authorLabel(post.createdBy)}
                createdAt={formatPostDate(post.createdAt)}
                image={post.image}
                delay={index * 200}
              />
            ))}
        </div>
      </section>


      {/* Naksa 1967 Banner */}
      <section className="banner-section">
        <NaksaBanner />
      </section>

      {/* Palestine History Section */}
      <section className="history-section">
        <div className="section-header">
          <span className="section-line section-line-green"></span>
          <h2 className="section-title section-title-green">Palestine History</h2>
          <span className="section-line section-line-green"></span>
        </div>
        <div className="history-grid">
          {historyFacts.map((fact, index) => (
            <div 
              key={index} 
              className="history-card" 
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="history-card-image-wrapper">
                <img 
                  src={fact.image} 
                  alt={fact.title} 
                  className="history-card-image"
                  loading="lazy"
                />
                <div className="history-card-overlay">
                  <span className="history-card-year">{fact.year}</span>
                </div>
              </div>
              <div className="history-card-content">
                <h3 className="history-card-title">{fact.title}</h3>
                <p className="history-card-text">{fact.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Heroes Section */}
      <section className="heroes-section">
        <div className="section-header">
          <span className="section-line section-line-green"></span>
          <h2 className="section-title section-title-green">Heroes of the Cause</h2>
          <span className="section-line section-line-green"></span>
        </div>
        <div className="heroes-grid">
          {people.map((person, index) => (
            <div
              key={index}
              className="hero-card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="hero-avatar-wrapper">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="hero-avatar"
                  loading="lazy"
                />
              </div>
              <div className="hero-card-content">
                <h3 className="hero-card-name">{person.name}</h3>
                <p className="hero-card-description">{person.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facts Section */}
      <section className="facts-section">
        <div className="section-header">
          <span className="section-line section-line-red"></span>
          <h2 className="section-title section-title-red">Facts That Cannot Be Denied</h2>
          <span className="section-line section-line-red"></span>
        </div>
        <div className="facts-grid">
          {keyFacts.map((fact, index) => (
            <div 
              key={index} 
              className="fact-image-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="fact-image-wrapper">
                <img 
                  src={fact.image} 
                  alt={fact.text} 
                  className="fact-image"
                  loading="lazy"
                />
                <div className="fact-image-overlay">
                  <span className="fact-icon">{fact.icon}</span>
                </div>
              </div>
              <div className="fact-image-content">
                <p className="fact-image-text">{fact.text}</p>
                <p className="fact-image-caption">{fact.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Quote */}
      <section className="quote-section">
        <blockquote className="quote-block">
          <p className="quote-text">
            &ldquo;They thought they could erase us from existence. They forgot we are the roots of this land.&rdquo;
          </p>
          <cite className="quote-author">— Palestinian Elder</cite>
        </blockquote>
      </section>
    </main>
  );
}
