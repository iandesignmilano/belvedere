// next
import Link from "next/link"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface CookieProps {
    info: string;
    email: string;
    settings?: {
        form?: boolean;
        analitycs?: boolean;
        font?: boolean;
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// months
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "DIcembre"
]

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// code
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function CookiePage({
    info = "Ian Design",
    email = "iandesign@gmail.com",
    settings = {
        form: true,
        analitycs: true,
        font: true
    }
}: CookieProps) {

    const date = new Date()

    return (
        <section className='container mx-auto py-6 lg:px-0 px-4'>

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h2 className='text-primary text-xl md:text-3xl'>Cookie policy</h2>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <p className="text-sm">
                Questo documento contiene informazioni in merito alle tecnologie che consentono a questa Applicazione di
                raggiungere gli scopi descritti di seguito. Tali tecnologie permettono al Titolare di raccogliere e
                salvare informazioni (per esempio tramite l’utilizzo di Cookie) o di utilizzare risorse
                (per esempio eseguendo uno script) sul dispositivo dell’Utente quando quest’ultimo interagisce con
                questa Applicazione.
                <br /><br />
                Per semplicità, in questo documento tali tecnologie sono sinteticamente definite “Strumenti di Tracciamento”,
                salvo vi sia ragione di differenziare.
                Per esempio, sebbene i Cookie possano essere usati in browser sia web sia mobili, sarebbe fuori
                luogo parlare di Cookie nel contesto di applicazioni per dispositivi mobili, dal momento che si tratta
                di Strumenti di Tracciamento che richiedono la presenza di un browser. Per questo motivo, all’interno di
                questo documento il termine Cookie è utilizzato solo per indicare in modo specifico quel particolare tipo
                di Strumento di Tracciamento.
                <br /><br />
                Alcune delle finalità per le quali vengono impiegati Strumenti di Tracciamento potrebbero, inoltre richiedere
                il consenso dell’Utente. Se viene prestato il consenso, esso può essere revocato liberamente in qualsiasi
                momento seguendo le istruzioni contenute in questo documento.
                <br /><br />
                Questa Applicazione utilizza Strumenti di Tracciamento gestiti direttamente dal Titolare
                (comunemente detti Strumenti di Tracciamento “di prima parte”) e Strumenti di Tracciamento che abilitano
                servizi forniti da terzi (comunemente detti Strumenti di Tracciamento “di terza parte”). Se non diversamente
                specificato all’interno di questo documento, tali terzi hanno accesso ai rispettivi Strumenti di Tracciamento.
                Durata e scadenza dei Cookie e degli altri Strumenti di Tracciamento simili possono variare a seconda
                di quanto impostato dal Titolare o da ciascun fornitore terzo. Alcuni di essi scadono al termine della sessione di navigazione dell’Utente.
                In aggiunta a quanto specificato nella descrizione di ciascuna delle categorie di seguito riportate,
                gli Utenti possono ottenere informazioni più dettagliate ed aggiornate sulla durata, così come qualsiasi
                altra informazione rilevante - quale la presenza di altri Strumenti di Tracciamento - nelle privacy policy
                dei rispettivi fornitori terzi (tramite i link messi a disposizione) o contattando il Titolare.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>
                Attività strettamente necessarie a garantire il funzionamento di
                questa Applicazione e la fornitura del Servizio
            </h4>
            <p className='text-sm'>
                Questa Applicazione utilizza Cookie comunemente detti “tecnici” o altri Strumenti di Tracciamento analoghi per svolgere attività strettamente
                necessarie a garantire il funzionamento o la fornitura del Servizio.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>
                Altre attività che prevedono l’utilizzo di Strumenti di Tracciamento
            </h4>
            <p className='text-sm'>
                <strong>Esperienza</strong>
                <br />
                Questa Applicazione utilizza Strumenti di Tracciamento per migliorare la qualità della user experience e consentire le interazioni con contenuti,
                network e piattaforme esterni.
            </p>
            {settings.font && (
                <div className="border rounded-md p-4 my-4">
                    <h4 className=' text-primary text-lg'>Visualizzazione di contenuti da piattaforme esterne</h4>
                    <p className="text-sm mt-4">
                        Questo tipo di servizi permette di visualizzare contenuti ospitati su piattaforme esterne direttamente dalle pagine di questa Applicazione
                        e di interagire con essi. Tali servizi sono spesso definiti widget, ovvero piccoli elementi inseriti in un sito web o in un&rsquo;applicazione.
                        Forniscono informazioni specifiche o svolgono una funzione particolare e spesso consentono l&rsquo;interazione con l&rsquo;utente.
                        Questo tipo di servizio potrebbe comunque raccogliere dati sul traffico web relativo alle pagine dove il servizio è installato,
                        anche quando gli utenti non lo utilizzano.
                        <br /><br />
                        <strong>Google Fonts</strong>
                        <br />
                        Google Fonts è un servizio di visualizzazione di stili di carattere gestito da Google LLC oppure da Google Ireland Limited, a seconda di come il Titolare
                        gestisce il trattamento dei Dati, che permette a questa Applicazione di integrare tali contenuti all’interno delle proprie pagine.
                        <br /><br />
                        Dati Personali trattati: Dati di utilizzo; Strumenti di Tracciamento.
                        <br /><br />
                        Luogo del trattamento: Stati Uniti – <Link rel="nofollow" title="link privacy google font" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link>
                        <br />
                        Irlanda – <Link rel="nofollow" title="link privacy google font" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link>
                    </p>
                </div>
            )}
            <p className="text-sm">
                <strong>Misurazione</strong>
                <br />
                Questa Applicazione utilizza Strumenti di Tracciamento per misurare il traffico e analizzare il comportamento degli Utenti per migliorare il Servizio.
            </p>
            {settings.analitycs && (
                <div className="border rounded-md p-4 my-4">
                    <h4 className=' text-primary text-lg'>Statistica</h4>
                    <p className="text-sm mt-4">
                        I servizi contenuti nella presente sezione permettono al Titolare del Trattamento di monitorare e analizzare i dati di
                        traffico e servono a tener traccia del comportamento dell’Utente.
                        <br /><br />
                        <strong>Google Analytics (Universal Analytics)</strong>
                        <br />
                        Google Analytics (Universal Analytics) è un servizio di analisi web fornito da Google LLC oppure da Google Ireland Limited, a seconda di come il Titolare gestisce il trattamento dei Dati, (“Google”). Google utilizza i Dati Personali raccolti allo scopo di tracciare ed esaminare l’utilizzo di questa Applicazione, compilare report e condividerli con gli altri servizi sviluppati da Google.
                        Google potrebbe utilizzare i Dati Personali per contestualizzare e personalizzare gli annunci del proprio network pubblicitario.
                        <br /><br />
                        Dati Personali trattati: Dati di utilizzo; Strumenti di Tracciamento.
                        <br /><br />
                        Luogo del trattamento: Stati Uniti
                        – <Link rel="nofollow" title="link privacy google analytics" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link> &nbsp;
                        – <Link rel="nofollow" title="link privacy google analytics" href="https://tools.google.com/dlpage/gaoptout?hl=it" className='text-primary' target='_blank'>Opt Out</Link>; &nbsp;
                        Irlanda
                        – <Link rel="nofollow" title="link privacy google analytics" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link> &nbsp;
                        – <Link rel="nofollow" title="link privacy google analytics" href="https://tools.google.com/dlpage/gaoptout?hl=it" className='text-primary' target='_blank'>Opt Out</Link>.
                        <br /><br />
                        Durata di archiviazione:
                        <br /><br />
                    </p>
                    <ul className="text-sm list-disc mb-4">
                        <li className="ml-4 mb-3">AMP_TOKEN: 1 ora</li>
                        <li className="ml-4 mb-3">_ga: 2 anni</li>
                        <li className="ml-4 mb-3">_gac*: 3 mesi</li>
                        <li className="ml-4 mb-3">_gat: 1 minuto</li>
                        <li className="ml-4">_gid: 1 giorno</li>
                    </ul>
                </div>
            )}

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>
                Come gestire le preferenze e prestare o revocare il consenso
            </h4>
            <p className='text-sm'>
                Esistono vari modi per gestire le preferenze relative agli Strumenti di Tracciamento e per prestare o revocare il consenso, ove necessario:
                <br /><br />
                Gli Utenti possono gestire le preferenze relative agli Strumenti di Tracciamento direttamente tramite
                le impostazioni dei propri dispositivi - per esempio, possono impedire l’uso o l’archiviazione di Strumenti di Tracciamento.
                <br /><br />
                In aggiunta, ogni qualvolta l’utilizzo di Strumenti di Tracciamento dipenda da consenso, l’Utente può prestare
                o revocare tale consenso impostando le proprie preferenze all’interno dell’informativa sui cookie o aggiornando
                tali preferenze tramite il widget privacy per le preferenze relative al consenso, se presente.
                <br /><br />
                Grazie ad apposite funzioni del browser o del dispositivo è anche possibile rimuovere Strumenti di Tracciamento precedentemente salvati,
                inclusi quelli utilizzati per il salvataggio delle preferenze relative al consenso inizialmente espresse dall&rsquo;Utente.
                <br /><br />
                Altri Strumenti di Tracciamento presenti nella memoria locale del browser possono essere rimossi cancellando la cronologia di navigazione.
                <br /><br />
                Per quanto riguarda Strumenti di Tracciamento di terza parte, gli Utenti possono gestire le proprie preferenze visitando il relativo
                link di opt out (qualora disponibile), utilizzando gli strumenti descritti nella privacy policy della terza parte o contattando quest&rsquo;ultima direttamente.
                <br /><br />
                <strong>Individuare le impostazioni relative agli Strumenti di Tracciamento</strong>
                <br />
                Gli Utenti possono, per esempio, trovare informazioni su come gestire i Cookie in alcuni dei browser più diffusi ai seguenti indirizzi:
                <br /><br />
            </p>
            <ul className="text-sm list-disc mb-4">
                <li className="ml-4 mb-3">
                    <Link rel="nofollow" title="link privacy browser" href="https://support.google.com/chrome/answer/95647?hl=it&p=cpn_cookies" target="_blank" className="text-primary">Google Chrome</Link>
                </li>
                <li className="ml-4 mb-3">
                    <Link rel="nofollow" title="link privacy browser" href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop?redirectslug=Attivare+e+disattivare+i+cookie&redirectlocale=it" target="_blank" className="text-primary">Mozilla Firefox</Link>
                </li>
                <li className="ml-4 mb-3">
                    <Link rel="nofollow" title="link privacy browser" href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" className="text-primary">Apple Safari</Link>
                </li>
                <li className="ml-4 mb-3">
                    <Link rel="nofollow" title="link privacy browser" href="https://support.microsoft.com/it-it/windows/eliminare-e-gestire-i-cookie-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" className="text-primary">Microsoft Internet Explorer</Link>
                </li>
                <li className="ml-4 mb-3">
                    <Link rel="nofollow" title="link privacy browser" href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" className="text-primary">Microsoft Edge</Link>
                </li>
                <li className="ml-4 mb-3">
                    <Link rel="nofollow" title="link privacy browser" href="https://support.brave.com/hc/en-us/articles/360022806212-How-do-I-use-Shields-while-browsing" target="_blank" className="text-primary">Brave</Link>
                </li>
                <li className="ml-4 mb-3">
                    <Link rel="nofollow" title="link privacy browser" href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank" className="text-primary">Opera</Link>
                </li>
            </ul>
            <p className="text-sm">
                Gli Utenti possono inoltre gestire alcuni Strumenti di Tracciamento per applicazioni mobili disattivandoli tramite le apposite
                impostazioni del dispositivo, quali le impostazioni di pubblicità per dispositivi mobili o le impostazioni relative al tracciamento
                in generale (gli Utenti possono consultare le impostazioni del dispositivo per individuare quella pertinente).
                <br /><br />
                <strong>Conseguenze legate al rifiuto dell&rsquo;utilizzo di Strumenti di Tracciamento</strong>
                <br />
                Gli Utenti sono liberi di decidere se permettere o meno l&rsquo;utilizzo di Strumenti di Tracciamento. Tuttavia, si noti
                che gli Strumenti di Tracciamento consentono a questa Applicazione di fornire agli Utenti un&rsquo;esperienza migliore e
                funzionalità avanzate (in linea con le finalità delineate nel presente documento). Pertanto, qualora l&rsquo;Utente decida di bloccare
                l&rsquo;utilizzo di Strumenti di Tracciamento, il Titolare potrebbe non essere in grado di fornire le relative funzionalità.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>
                Titolare del Trattamento dei Dati
            </h4>
            <p className='text-sm'>
                Titolare: {info}
                <br /><br />
                Indirizzo email del Titolare: {email}
                <br /><br />
                Dal momento che l’uso di Strumenti di Tracciamento di terza parte su questa Applicazione non può essere completamente controllato dal Titolare,
                ogni riferimento specifico a Strumenti di Tracciamento di terza parte è da considerarsi indicativo.
                Per ottenere informazioni complete, gli Utenti sono gentilmente invitati a consultare la privacy policy
                dei rispettivi servizi terzi elencati in questo documento.
                <br /><br />
                Data l&rsquo;oggettiva complessità di identificazione delle tecnologie di tracciamento, gli Utenti sono invitati a contattare il
                Titolare qualora volessero ricevere ulteriori informazioni in merito all&rsquo;utilizzo di tali tecnologie su questa Applicazione.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className="text-primary text-lg mb-4">Definizioni e riferimenti legali</h4>
            <p className="text-sm">
                <strong>Dati Personali (o Dati)</strong>
                <br />
                Costituisce dato personale qualunque informazione che, direttamente o indirettamente, anche in collegamento con qualsiasi altra informazione,
                ivi compreso un numero di identificazione personale, renda identificata o identificabile una persona fisica.
                <br /><br />
                <strong>Dati di Utilizzo</strong>
                <br />
                Sono le informazioni raccolte automaticamente attraverso questa Applicazione (anche da applicazioni di parti terze integrate in questa Applicazione),
                tra cui: gli indirizzi IP o i nomi a dominio dei computer utilizzati dall’Utente che si connette con questa Applicazione,
                gli indirizzi in notazione URI (Uniform Resource Identifier), l’orario della richiesta, il metodo utilizzato nell’inoltrare
                la richiesta al server, la dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della risposta
                dal server (buon fine, errore, ecc.) il paese di provenienza, le caratteristiche del browser e del sistema operativo utilizzati
                dal visitatore, le varie connotazioni temporali della visita (ad esempio il tempo di permanenza su ciascuna pagina) e i dettagli
                relativi all’itinerario seguito all’interno dell’Applicazione, con particolare riferimento alla sequenza delle pagine consultate,
                ai parametri relativi al sistema operativo e all’ambiente informatico dell’Utente.
                <br /><br />
                <strong>Utente</strong>
                <br />
                L&rsquo;individuo che utilizza questa Applicazione che, salvo ove diversamente specificato, coincide con l&rsquo;Interessato.
                <br /><br />
                <strong>Interessato</strong>
                <br />
                La persona fisica cui si riferiscono i Dati Personali.
                <br /><br />
                <strong>Responsabile del Trattamento (o Responsabile)</strong>
                <br />
                La persona fisica, giuridica, la pubblica amministrazione e qualsiasi altro ente che tratta dati personali per conto del Titolare,
                secondo quanto esposto nella presente privacy policy.
                <br /><br />
                <strong>Titolare del Trattamento (o Titolare)</strong>
                <br />
                La persona fisica o giuridica, l&rsquo;autorità pubblica, il servizio o altro organismo che, singolarmente o insieme ad altri,
                determina le finalità e i mezzi del trattamento di dati personali e gli strumenti adottati, ivi comprese le misure di
                sicurezza relative al funzionamento ed alla fruizione di questa Applicazione. Il Titolare del Trattamento, salvo quanto
                diversamente specificato, è il titolare di questa Applicazione.
                <br /><br />
                <strong>Questa Applicazione</strong>
                <br />
                Lo strumento hardware o software mediante il quale sono raccolti e trattati i Dati Personali degli Utenti.
                <br /><br />
                <strong>Servizio</strong>
                <br />
                Il Servizio fornito da questa Applicazione così come definito nei relativi termini (se presenti) su questo sito/applicazione.
                <br /><br />
                <strong>Unione Europea (o UE)</strong>
                <br />
                Salvo ove diversamente specificato, ogni riferimento all’Unione Europea contenuto in questo documento si intende esteso
                a tutti gli attuali stati membri dell’Unione Europea e dello Spazio Economico Europeo.
                <br /><br />
                <strong>Cookie</strong>
                <br />
                I Cookie sono Strumenti di Tracciamento che consistono in piccole porzioni di dati conservate all&rsquo;interno del browser dell&rsquo;Utente.
                <br /><br />
                <strong>Strumento di Tracciamento</strong>
                <br />
                Per Strumento di Tracciamento s’intende qualsiasi tecnologia - es. Cookie, identificativi univoci, web beacons, script integrati, e-tag e fingerprinting
                - che consenta di tracciare gli Utenti, per esempio raccogliendo o salvando informazioni sul dispositivo dell’Utente.
                <br /><br />
                <strong>Riferimenti legali</strong>
                <br />
                Ove non diversamente specificato, questa informativa privacy riguarda esclusivamente questa Applicazione.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <p className="text-sm">Ultima modifica: {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()}</p>

        </section>
    )
}