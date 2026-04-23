import{_ as o,A as r,B as e,L as h,M as u,C as i,z as s,S as d,P as g}from"./BLbVoJMa.js";const m={name:"MailClient",data(){return{mails:[{id:1,sender:"security@m1crosoft-support.com",subject:"Dringend: Verdächtiger Anmeldeversuch auf Ihrem Microsoft-Konto",date:"2025-05-22",body:`Hallo,

Wir haben einen ungewöhnlichen Anmeldeversuch in Ihrem Microsoft-Konto festgestellt.

Gerät: Windows 10  
Standort: Bukarest, Rumänien  
Zeit: 22. Mai 2025, 03:43 Uhr

Wenn Sie dies nicht waren, klicken Sie sofort hier, um Ihr Konto zu schützen:  
http://m1crosoft-security-check.insecure-domain.xyz

Danke,  
Microsoft Sicherheitsdienst`,read:!1},{id:2,sender:"noreply@dhl-paketservice.net",subject:"Ihr Paket konnte nicht zugestellt werden – Handlungsbedarf erforderlich!",date:"2025-05-21",body:`Sehr geehrte Kundin, sehr geehrter Kunde,

Ihre Sendung mit der Trackingnummer DHL-593823234 konnte nicht zugestellt werden.

Um eine erneute Zustellung zu veranlassen, bestätigen Sie bitte Ihre Adresse hier:  
http://dhl.redelivery-check.co.uk.unsecure.site

Falls wir keine Rückmeldung innerhalb von 24 Stunden erhalten, wird das Paket retourniert.

Mit freundlichen Grüßen,  
Ihr DHL-Kundenservice`,read:!1},{id:3,sender:"service@paypa1.com",subject:"Ihr Konto wurde vorübergehend eingeschränkt",date:"2025-05-20",body:`Lieber Kunde,

Wir haben verdächtige Aktivitäten auf Ihrem PayPal-Konto festgestellt und es daher vorübergehend eingeschränkt.

Um den Zugriff wiederherzustellen, verifizieren Sie bitte Ihre Daten unter folgendem Link:  
http://paypa1.secure-checkup.io

Diese Maßnahme dient Ihrer Sicherheit. Bitte reagieren Sie umgehend.

Vielen Dank,  
Ihr PayPal-Sicherheitsteam`,read:!1},{id:4,sender:"kevin.it@unternehmen-support.de",subject:"Dringend: Sicherheitsupdate benötigt Ihre Mitarbeit",date:"2025-05-19",body:`Hallo Max,

Wir führen aktuell ein kritisches Sicherheitsupdate auf allen Rechnern durch.

Bitte sende mir kurzfristig deinen Windows-Benutzernamen und dein aktuelles Passwort, damit wir das Update remote einspielen können.

Vielen Dank für deine schnelle Rückmeldung!

Beste Grüße,  
Kevin (IT Helpdesk)`,read:!1},{id:5,sender:"bewerbung@outlook.de",subject:"Bewerbung auf Ihre Stellenanzeige vom 21.05.2025",date:"2025-05-21",body:`Sehr geehrte Damen und Herren,

anbei sende ich Ihnen meine vollständigen Bewerbungsunterlagen als PDF.

Ich freue mich auf die Möglichkeit, mich in Ihrem Unternehmen einzubringen.

Mit freundlichen Grüßen  
Anna Lehmann

Anhang: Bewerbung_AnnaLehmann.pdf.exe`,read:!1},{id:6,sender:"gewinnen@amzn-de-gutschein.com",subject:"Herzlichen Glückwunsch! Sie haben gewonnen!",date:"2025-05-23",body:`Lieber Teilnehmer,

Sie wurden zufällig ausgewählt und haben einen 100€ Amazon-Gutschein gewonnen!

Um Ihren Gewinn zu sichern, klicken Sie einfach auf den folgenden Link und bestätigen Sie Ihre Daten:  
http://gewinnspiel-center.amzn-de-gutschein.com

Achtung: Dieses Angebot ist nur 48 Stunden gültig!

Viel Glück weiterhin,  
Das Amazon Gewinnspiel-Team`,read:!1}],selectedMail:null}},methods:{selectMail(a){this.selectedMail=a,a.read||(a.read=!0)}}},b={class:"min-h-screen bg-white"},f={class:"flex h-full"},k={class:"w-1/3 bg-white border-r border-gray-300 overflow-y-auto"},p=["onClick"],y={class:"flex items-center"},w={key:0,class:"w-1.5 h-1.5 bg-gray-900 rounded-full mr-2 mt-1"},_={class:"flex-1 p-6 overflow-y-auto"},v={key:0,class:"space-y-4"},x={class:"text-2xl font-bold text-gray-900"},M={class:"text-sm text-gray-500"},S={class:"text-sm text-gray-500"},z={class:"text-gray-800 whitespace-pre-line"},I={key:1,class:"text-gray-500 text-center mt-20"};function D(a,l,B,A,t,c){return s(),r("div",b,[e("div",f,[e("aside",k,[e("ul",null,[(s(!0),r(h,null,u(t.mails,n=>(s(),r("li",{key:n.id,onClick:L=>c.selectMail(n),class:d(["p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-200 transition",n.id===t.selectedMail?.id?"bg-blue-100":"",(n.read,"bg-white")])},[e("div",y,[n.read?g("",!0):(s(),r("span",w)),e("span",{class:d(n.read?"font-normal text-gray-800":"font-semibold text-gray-900")},i(n.sender),3)]),e("div",{class:d(["text-sm truncate p-1",n.read?"text-gray-600":"text-gray-800"])},i(n.subject),3)],10,p))),128))])]),e("main",_,[t.selectedMail?(s(),r("div",v,[e("div",null,[e("h2",x,"From: "+i(t.selectedMail.sender),1),e("p",M,i(t.selectedMail.subject),1),e("p",S,i(t.selectedMail.date),1)]),l[0]||(l[0]=e("hr",{class:"my-2 border-gray-300"},null,-1)),e("p",z,i(t.selectedMail.body),1)])):(s(),r("div",I," Bitte eine E-Mail aus der Liste auswählen. "))])])])}const G=o(m,[["render",D]]);export{G as default};
