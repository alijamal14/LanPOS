
import React from 'react';

const architectureDiagram = `
[ User Device: Tablet/PC ]      <-- Wi-Fi / Ethernet -->      [ LAN Switch/Router ]
+-------------------------+                                   +-------------------+
|      LAN-POS App        |                                   |                   |
|  (React SPA in Browser) |                                   |                   |
+-------------------------+         +-------------------+     | (No Internet      |
| UI (Tailwind/DaisyUI)   |         | Signaling Server  |     |  Connection       |
| PWA (Workbox)           |         | (Node.js on LAN)  |     |  Required)        |
| State & Logic           |         +-------------------+     |                   |
| Data Persistence        |                   ^               |                   |
| +---------------------+ |                   |               |                   |
| | IndexedDB (Y-indexeddb)|<--+               | P2P Handshake |                   |
| +---------------------+ |  |               | (WebRTC)      |                   |
| | CRDTs (Y.js/Gun)    | |  |               v               |                   |
| +---------------------+ |  | P2P Sync      +-------------------+
| | Auth (SEA/JWT)      | |  | (WebRTC)
| +---------------------+ |  |
+-------------------------+  |
                           |
                           v
[ Peer Device: Tablet/PC  ]
+-------------------------+
|      LAN-POS App        |
| (Identical to above)    |
+-------------------------+
`;

const stackReasoning = `
The chosen stack prioritizes minimizing custom code by leveraging high-level, specialized libraries for complex tasks, ensuring rapid development and robustness for an offline-first LAN environment.

1.  **GUN (Graph Universe) + SEA (Security, Encryption, Authorization):** Preferred over Y.js for its integrated, decentralized approach. GUN provides a real-time, offline-first, peer-to-peer graph database out of the box. SEA, its built-in cryptographic layer, handles user authentication and data encryption seamlessly, drastically reducing the custom code needed for auth and security. This combination is purpose-built for decentralized applications.

2.  **Y.js + y-webrtc + y-indexeddb:** A strong alternative. Y.js is a proven CRDT implementation for conflict-free data merging. It requires combining separate modules for P2P networking (y-webrtc) and persistence (y-indexeddb), which is slightly more boilerplate than GUN but offers excellent performance and fine-grained control.

3.  **IndexedDB with a Library (via Y.js/GUN):** Direct IndexedDB API is verbose. Using the persistence adapters from Y.js or GUN abstracts away the complexity, providing a simple, promise-based API for local storage that's already integrated with the P2P data layer.

4.  **Workbox:** The industry standard for building production-ready Progressive Web Apps (PWAs). It simplifies service worker registration, caching strategies (cache-first for offline assets), and background sync, eliminating vast amounts of complex, error-prone custom service worker code.

5.  **DaisyUI / Tailwind UI:** These component libraries built on Tailwind CSS provide pre-built, accessible, and aesthetically pleasing UI components (buttons, modals, forms). This allows developers to assemble a professional-looking POS interface quickly without writing custom CSS or complex component logic.

6.  **Zod & Day.js:** Zod for schema validation ensures data integrity with a declarative, TypeScript-first API. Day.js provides a lightweight, modern API for date/time manipulation, simplifying tasks like handling timestamps for orders and shifts.
`;

const deploymentGuide = `
**1. Signaling Server Setup (Node.js)**
   A WebRTC signaling server is required for peers to find each other on the LAN. It only brokers initial connections and does not handle app data.

   - **Prerequisites:** Node.js installed on a stable machine on the LAN (e.g., a back-office PC).
   - **Implementation:** Use a minimal server like \`simple-peer-server\` or a basic WebSocket server (\`ws\` package).
     \`\`\`javascript
     // Example simple-peer-server
     // server.js
     require('simple-peer-server')({ port: 8081 });
     console.log('Signaling server running on port 8081');
     \`\`\`
   - **Running:** Run \`node server.js\`. Ensure the firewall on the server machine allows traffic on the chosen port (e.g., 8081).
   - **Client Config:** In the React app, configure the WebRTC provider (e.g., y-webrtc) to point to the server's LAN IP address: \`ws://192.168.1.100:8081\`.

**2. Application Deployment**
   The React app is a set of static files (HTML, JS, CSS).

   - **Build the App:** Run \`npm run build\` (or equivalent) to generate the production files in a \`dist/\` directory.
   - **Serve the Files:** Use a simple static file server on the same machine as the signaling server or any other machine on the LAN.
     - Example using \`serve\`: \`npx serve -s dist -l 3000\`.
   - **Access:** Devices on the LAN can access the POS by navigating to the server's LAN IP and port in their browser (e.g., \`http://192.168.1.100:3000\`).

**3. (Optional) TURN Server**
   - A TURN server is generally **not required** for a typical flat LAN where all devices can see each other. It's needed to relay traffic if peers are on different subnets or behind restrictive NATs, which is uncommon in a standard small business LAN setup. If needed, \`coturn\` is a popular open-source option that can be installed on a Linux server on the network.
`;

const securityChecklist = `
**1. Physical Network Security:**
   - [ ] Secure the Wi-Fi network with WPA2/WPA3 and a strong password.
   - [ ] Use a separate, isolated VLAN for POS devices if possible, restricting access from guest networks or other non-essential devices.
   - [ ] Restrict physical access to the LAN router, switch, and server hardware.

**2. Application-Level Security:**
   - [ ] **Data Encryption:** Ensure the P2P library (e.g., GUN's SEA) encrypts all data at rest (IndexedDB) and in transit (WebRTC uses DTLS-SRTP by default).
   - [ ] **Authentication:** Use a strong, local authentication mechanism. With SEA, user accounts are based on cryptographic key pairs. Do not store plain-text secrets.
   - [ ] **Role-Based Access Control (RBAC):** Enforce permissions rigorously in the UI and (if applicable) data validation logic. Prevent cashiers from accessing admin/manager functions.
   - [ ] **Input Validation:** Use a library like Zod to validate all data inputs to prevent malformed data from corrupting the shared state.

**3. Operational Security:**
   - [ ] **Audit Logging:** Implement comprehensive audit logs for sensitive actions (e.g., logins, order voids, discounts applied, shift closing). These logs should be part of the synced, immutable data structure.
   - [ ] **Regular Backups:** The admin node should have a simple mechanism to export a snapshot of the entire database state as an encrypted file. This backup should be stored securely on a separate device.
   - [ ] **Software Updates:** Keep the Node.js runtime and all library dependencies (especially those related to crypto and networking) up to date by periodically running \`npm audit\` and updating packages in a controlled manner.
`;

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-300 mb-3 border-l-4 border-brand-primary pl-3">{title}</h3>
        {children}
    </div>
);

const SystemInfo: React.FC = () => {
  return (
    <div className="font-mono text-sm text-gray-300 bg-gray-800 p-4 rounded-md">
      <InfoSection title="1. Architecture Diagram (ASCII)">
        <pre className="whitespace-pre-wrap bg-gray-900 p-4 rounded-lg overflow-x-auto">{architectureDiagram.trim()}</pre>
      </InfoSection>

      <InfoSection title="2. Reasoning for Chosen Stack">
        <div className="whitespace-pre-wrap font-sans text-gray-400 prose prose-invert prose-sm">{stackReasoning.trim()}</div>
      </InfoSection>

      <InfoSection title="3. LAN Deployment Guide">
        <div className="whitespace-pre-wrap font-sans text-gray-400 prose prose-invert prose-sm">{deploymentGuide.trim()}</div>
      </InfoSection>

      <InfoSection title="4. Security Checklist for Local Deployment">
         <div className="whitespace-pre-wrap font-sans text-gray-400 prose prose-invert prose-sm">{securityChecklist.trim()}</div>
      </InfoSection>
    </div>
  );
};

export default SystemInfo;
