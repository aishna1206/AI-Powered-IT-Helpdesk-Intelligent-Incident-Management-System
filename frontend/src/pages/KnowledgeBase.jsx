import { useMemo, useState } from "react";

import {
  Search,
  BookOpen,
  Wifi,
  Mail,
  ShieldCheck,
  Printer,
  Laptop,
  RotateCcw,
} from "lucide-react";

import "./KnowledgeBase.css";


const articles = [
  {
    id: 1,
    title: "WiFi connection problems",
    category: "Network",
    icon: Wifi,
    description:
      "Troubleshoot common office WiFi connection and internet access problems.",
    steps: [
      "Check whether other devices can access the same network.",
      "Disconnect and reconnect to the office WiFi.",
      "Restart the network adapter.",
      "Flush the DNS cache if websites are still unavailable.",
    ],
  },

  {
    id: 2,
    title: "Outlook email not syncing",
    category: "Software",
    icon: Mail,
    description:
      "Steps to troubleshoot delayed or missing email synchronization in Outlook.",
    steps: [
      "Check that the device has an active internet connection.",
      "Restart Outlook.",
      "Verify the Outlook account is connected.",
      "Restart the device if synchronization remains stuck.",
    ],
  },

  {
    id: 3,
    title: "Password reset",
    category: "Access",
    icon: ShieldCheck,
    description:
      "General steps for resolving account password and access issues.",
    steps: [
      "Verify the correct corporate account is being used.",
      "Use the organization's password reset process.",
      "Complete any required identity verification.",
      "Contact IT support if the account remains locked.",
    ],
  },

  {
    id: 4,
    title: "Printer not working",
    category: "Hardware",
    icon: Printer,
    description:
      "Troubleshoot common office printer connection and printing issues.",
    steps: [
      "Check that the printer is powered on.",
      "Verify the device is connected to the correct network.",
      "Check whether the printer is showing an error.",
      "Restart the print queue or device if necessary.",
    ],
  },

  {
    id: 5,
    title: "Laptop running slowly",
    category: "Hardware",
    icon: Laptop,
    description:
      "Basic troubleshooting steps for slow system performance.",
    steps: [
      "Close applications that are not currently required.",
      "Restart the laptop.",
      "Check available storage space.",
      "Install pending organizational updates if available.",
    ],
  },

  {
    id: 6,
    title: "VPN connection issues",
    category: "Network",
    icon: RotateCcw,
    description:
      "Basic troubleshooting for corporate VPN connectivity problems.",
    steps: [
      "Verify the internet connection.",
      "Restart the VPN client.",
      "Check that the correct corporate credentials are being used.",
      "Contact IT support if the VPN server cannot be reached.",
    ],
  },
];


function KnowledgeBase() {

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    selectedArticle,
    setSelectedArticle,
  ] = useState(null);


  const filteredArticles =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return articles;
      }


      return articles.filter(
        (article) =>
          article.title
            .toLowerCase()
            .includes(query) ||

          article.category
            .toLowerCase()
            .includes(query) ||

          article.description
            .toLowerCase()
            .includes(query)
      );

    }, [search]);


  return (

    <div className="knowledge-base-page">

      <div className="knowledge-base-container">

        <div className="knowledge-base-heading">

          <div>

            <h1>
              Knowledge Base
            </h1>

            <p>
              Find quick solutions to common IT problems.
            </p>

          </div>

          <div className="knowledge-base-icon">
            <BookOpen size={24} />
          </div>

        </div>


        <div className="knowledge-base-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search for an IT problem..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <div className="knowledge-base-grid">

          {filteredArticles.map(
            (article) => {

              const Icon =
                article.icon;


              return (

                <button
                  type="button"
                  className="knowledge-article"
                  key={article.id}
                  onClick={() =>
                    setSelectedArticle(
                      article
                    )
                  }
                >

                  <div className="knowledge-article-icon">
                    <Icon size={20} />
                  </div>


                  <div className="knowledge-article-content">

                    <span className="knowledge-category">
                      {article.category}
                    </span>

                    <h2>
                      {article.title}
                    </h2>

                    <p>
                      {article.description}
                    </p>

                    <span className="knowledge-read">
                      View troubleshooting steps →
                    </span>

                  </div>

                </button>

              );

            }
          )}

        </div>


        {filteredArticles.length === 0 && (

          <div className="knowledge-empty">

            <Search size={30} />

            <h3>
              No articles found
            </h3>

            <p>
              Try a different search term.
            </p>

          </div>

        )}

      </div>


      {selectedArticle && (

        <div
          className="knowledge-modal-overlay"
          onClick={() =>
            setSelectedArticle(null)
          }
        >

          <div
            className="knowledge-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="knowledge-modal-header">

              <div>

                <span className="knowledge-category">
                  {selectedArticle.category}
                </span>

                <h2>
                  {selectedArticle.title}
                </h2>

              </div>


              <button
                type="button"
                className="knowledge-close"
                onClick={() =>
                  setSelectedArticle(null)
                }
              >
                ×
              </button>

            </div>


            <p className="knowledge-modal-description">
              {selectedArticle.description}
            </p>


            <h3>
              Troubleshooting Steps
            </h3>


            <div className="knowledge-steps">

              {selectedArticle.steps.map(
                (step, index) => (

                  <div
                    className="knowledge-step"
                    key={index}
                  >

                    <span>
                      {index + 1}
                    </span>

                    <p>
                      {step}
                    </p>

                  </div>

                )
              )}

            </div>


            <div className="knowledge-modal-note">

              <BookOpen size={15} />

              <span>
                If these steps do not resolve the issue,
                create an IT support ticket.
              </span>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


export default KnowledgeBase;