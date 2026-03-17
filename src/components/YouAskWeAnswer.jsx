import { useEffect, useRef, useState } from "react";
import "./YouAskWeAnswer.css";

/* ─────────────────────────────────────────────────────────────────
   Chat Messages Data
───────────────────────────────────────────────────────────────── */
const chatMessages = [
  {
    id: 1,
    type: "user",
    content: "What is Explainify?",
  },
  {
    id: 2,
    type: "ai",
    content:
      "Explainify is an AI-powered tool that simplifies documents into easy, understandable insights instantly.",
  },
  {
    id: 3,
    type: "user",
    content: "Can it summarize long PDFs quickly?",
  },
  {
    id: 4,
    type: "ai",
    content:
      "Yes, it analyzes large documents in seconds and gives you clear, concise summaries.",
  },
  {
    id: 5,
    type: "user",
    content: "How does it help students like me?",
  },
  {
    id: 6,
    type: "ai",
    content:
      "It helps you learn faster by breaking down complex topics, answering questions, and highlighting key points.",
  },
];

/* ─────────────────────────────────────────────────────────────────
   You Ask, We Answer Component
───────────────────────────────────────────────────────────────── */
export default function YouAskWeAnswer() {
  const sectionRef = useRef(null);
  const titleLeftRef = useRef(null);
  const titleRightRef = useRef(null);
  const messagesRefs = useRef([]);
  const [visibleMessages, setVisibleMessages] = useState(new Set());

  /* ─ Setup Intersection Observer for Messages ─ */
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px",
    };

    const messageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageId = parseInt(entry.target.dataset.messageId, 10);
          setVisibleMessages((prev) => new Set([...prev, messageId]));
        }
      });
    }, observerOptions);

    /* Observe all message elements */
    messagesRefs.current.forEach((ref) => {
      if (ref) {
        messageObserver.observe(ref);
      }
    });

    return () => {
      messagesRefs.current.forEach((ref) => {
        if (ref) {
          messageObserver.unobserve(ref);
        }
      });
    };
  }, []);

  /* ─ Setup Intersection Observer for Title ─ */
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px",
    };

    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          /* Trigger title animation */
          if (entry.target === titleLeftRef.current) {
            entry.target.classList.add("animate-title-left");
          }
          if (entry.target === titleRightRef.current) {
            entry.target.classList.add("animate-title-right");
          }
        }
      });
    }, observerOptions);

    if (titleLeftRef.current) {
      titleObserver.observe(titleLeftRef.current);
    }
    if (titleRightRef.current) {
      titleObserver.observe(titleRightRef.current);
    }

    return () => {
      if (titleLeftRef.current) {
        titleObserver.unobserve(titleLeftRef.current);
      }
      if (titleRightRef.current) {
        titleObserver.unobserve(titleRightRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 px-6"
      style={{
        background: "#2D0B3A",
      }}
    >
      {/* ─ Section Wrapper ─ */}
      <div className="max-w-4xl mx-auto">
        {/* ─ Animated Title ─ */}
        <div className="mb-16 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 flex-wrap">
          <h2
            ref={titleLeftRef}
            className="title-text title-left text-4xl md:text-5xl font-bold"
            style={{ color: "#FFFFFF" }}
          >
            You ask,
          </h2>
          <h2
            ref={titleRightRef}
            className="title-text title-right text-4xl md:text-5xl font-bold"
            style={{
              background: "linear-gradient(135deg, #A855F7 0%, #6A0DAD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            We answer
          </h2>
        </div>

        {/* ─ Chat Messages Container ─ */}
        <div className="space-y-6 md:space-y-8">
          {chatMessages.map((message, index) => (
            <div
              key={message.id}
              ref={(el) => {
                if (el) {
                  messagesRefs.current[index] = el;
                }
              }}
              data-message-id={message.id}
              className={`chat-message ${
                message.type === "user"
                  ? "chat-message-user message-left"
                  : "chat-message-ai message-right"
              } ${visibleMessages.has(message.id) ? "visible" : ""}`}
              style={{
                transitionDelay: `${visibleMessages.has(message.id) ? index * 0.2 : 0}s`,
              }}
            >
              <div className="chat-bubble">
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─ Decorative Glow ─ */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #A855F7 0%, #6A0DAD 100%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #6A0DAD 0%, #A855F7 100%)",
        }}
      />
    </section>
  );
}
