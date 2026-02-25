"use client";

export default function FooterStyles() {
  return (
    <style jsx global>{`
      .ghibli-forest-silhouette {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,120 L50,100 L100,120 L150,90 L200,120 L250,80 L300,120 L350,70 L400,120 L450,60 L500,120 L550,50 L600,120 L650,40 L700,120 L750,30 L800,120 L850,20 L900,120 L950,10 L1000,120 L1050,40 L1100,120 L1150,50 L1200,120 Z' fill='currentColor'%3E%3C/path%3E%3C/svg%3E");
        background-size: cover;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .ghibli-particles {
        position: absolute;
        inset: 0;
        background-image: 
          radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.05) 0.15%, transparent 0.15%),
          radial-gradient(circle at 50% 60%, hsl(var(--secondary) / 0.05) 0.1%, transparent 0.1%),
          radial-gradient(circle at 80% 10%, hsl(var(--accent) / 0.05) 0.12%, transparent 0.12%),
          radial-gradient(circle at 10% 70%, hsl(var(--primary) / 0.05) 0.1%, transparent 0.1%),
          radial-gradient(circle at 90% 90%, hsl(var(--secondary) / 0.05) 0.13%, transparent 0.13%);
        opacity: 0.3;
      }
      
      .footer-dust::before,
      .footer-dust::after {
        content: "";
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: hsl(var(--primary) / 0.6);
        opacity: 0.6;
        animation: float 8s infinite ease-in-out;
      }
      
      .footer-dust::before {
        left: 30%;
        top: 20%;
        animation-delay: 0s;
      }
      
      .footer-dust::after {
        left: 70%;
        top: 60%;
        animation-delay: 2s;
      }
      
      /* Magic portal animations */
      @keyframes portal-glow {
        0%, 100% { box-shadow: 0 0 3px hsl(var(--primary) / 0.3), 0 0 5px hsl(var(--primary) / 0.3); }
        50% { box-shadow: 0 0 8px hsl(var(--primary) / 0.5), 0 0 12px hsl(var(--primary) / 0.5); }
      }
      
      @keyframes float-micro {
        0%, 100% { transform: translateY(0) translateX(-50%); }
        50% { transform: translateY(-2px) translateX(-50%); }
      }
      
      /* Apply magic portal effects to footer links */
      footer a:hover {
        animation: portal-glow 2s infinite;
      }
      
      /* Subtle movement for the dock */
      footer:hover {
        animation: float-micro 3s infinite ease-in-out;
      }
      
      /* Custom cursor when hovering over footer */
      @media (pointer: fine) {
        footer {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14'%3E%3C/path%3E%3Cpath d='M5 12h14'%3E%3C/path%3E%3C/svg%3E"), auto;
        }
      }
      
      /* Fix for small screens */
      @media (max-width: 640px) {
        footer {
          max-width: 90vw;
        }
        
        footer a, footer button {
          width: 24px !important;
          height: 24px !important;
          padding: 0;
        }
        
        footer .text-xs {
          font-size: 0.65rem;
        }
      }
      
      /* Fix for Firefox */
      @-moz-document url-prefix() {
        footer {
          backdrop-filter: blur(8px);
          background-color: hsl(var(--background) / 0.85);
        }
      }
      
      /* Prevent the footer from taking up space in the flow */
      .fixed-footer-spacer {
        height: 0;
        margin: 0;
      }
    `}</style>
  );
}
