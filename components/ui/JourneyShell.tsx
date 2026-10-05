/**
 * Shared split-screen frame for the login and welcome screens: the campus
 * photo with the journey route on one side, a cream panel on the other
 * (stacked on phones).
 */

const STOPS = ["Airport", "EB3", "Tower", "EB5", "Cove"];

export default function JourneyShell({
  children,
  shellRef,
  panelRef,
}: {
  children: React.ReactNode;
  shellRef?: React.Ref<HTMLDivElement>;
  panelRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={shellRef} className="js-shell">
      <div className="js-photo">
        <div className="js-route">
          <b>Your journey</b>
          <div className="js-dots">
            {STOPS.map((s, i) => (
              <span key={s} className="js-dotwrap">
                <i />
                {i < STOPS.length - 1 && <u />}
              </span>
            ))}
          </div>
          <div className="js-labels">
            {STOPS.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="js-side">
        <div ref={panelRef} className="js-panel">
          {children}
        </div>
      </div>

      <style jsx global>{`
        .js-shell {
          position: fixed;
          inset: 0;
          display: flex;
          overflow: hidden;
          background: #fff;
          color: #16203a;
        }
        .js-photo {
          position: relative;
          flex: 1.15;
          background: url(/welcome/campus.jpg) 50% 40% / cover no-repeat;
        }
        .js-photo::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 236, 214, 0.35), rgba(22, 32, 58, 0.65));
        }
        .js-route {
          position: absolute;
          z-index: 2;
          left: 40px;
          right: 40px;
          bottom: 36px;
          padding: 18px 20px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: #fff;
        }
        .js-route b {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .js-dots {
          display: flex;
          align-items: center;
          margin-top: 14px;
        }
        .js-dotwrap {
          display: flex;
          align-items: center;
        }
        .js-dotwrap:not(:last-child) {
          flex: 1;
        }
        .js-dotwrap i {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(244, 63, 128, 0.7);
          flex: none;
        }
        .js-dotwrap u {
          flex: 1;
          height: 2px;
          margin: 0 6px;
          background: rgba(255, 255, 255, 0.7);
        }
        .js-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          font-weight: 600;
        }
        .js-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: linear-gradient(180deg, #fff6ee, #fbe3ec);
          overflow-y: auto;
        }
        .js-panel {
          width: min(380px, 100%);
        }
        .js-lock {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: #d81b60;
          display: grid;
          place-items: center;
          color: #fff;
          box-shadow: 0 10px 24px rgba(216, 27, 96, 0.35);
        }
        .js-eyebrow {
          margin-top: 22px;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #9e0f48;
          font-weight: 700;
        }
        .js-title {
          margin-top: 8px;
          font-size: 44px;
          line-height: 1.02;
          color: #16203a;
          text-wrap: balance;
        }
        .js-copy {
          margin-top: 8px;
          font-size: 14px;
          color: #5a4f5c;
        }
        .js-btn {
          width: 100%;
          margin-top: 14px;
          padding: 15px;
          border-radius: 14px;
          background: #d81b60;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          box-shadow: 0 10px 24px rgba(216, 27, 96, 0.3);
          border: 0;
          cursor: pointer;
        }
        .js-btn:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .js-hint {
          margin-top: 16px;
          font-size: 12px;
          color: #8b7a86;
        }
        @media (max-width: 760px) {
          .js-shell {
            flex-direction: column;
          }
          .js-photo {
            flex: none;
            height: 280px;
          }
          .js-route {
            left: 16px;
            right: 16px;
            bottom: 16px;
            padding: 12px 14px;
          }
          .js-side {
            flex: 1;
            align-items: flex-start;
            padding: 24px;
          }
          .js-title {
            font-size: 34px;
          }
        }
      `}</style>
    </div>
  );
}
