// next
import Link from "next/link"

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

interface PrivacyProps {
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

export default function PrivacyPage({
    info = "Ian Design",
    email = "iandesign@gmail.com",
    settings = {
        form: true,
        analitycs: true,
        font: true
    }
}: PrivacyProps) {

    const date = new Date()

    return (
        <section className='container mx-auto py-6 lg:px-0 px-4'>

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
				SEZIONE
			+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h2 className='text-primary text-xl md:text-3xl'>Privacy policy</h2>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>Titolare del Trattamento dei Dati</h4>
            <p className='text-sm'>
                Titolare: {info}
                <br /><br />
                Indirizzo email del Titolare: {email}
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>Tipologie di Dati raccolti</h4>
            <p className='text-sm'>
                Fra i Dati Personali raccolti da questa Applicazione, in modo autonomo o tramite terze parti, ci sono: Strumenti di
                Tracciamento; Dati di utilizzo; nome; cognome; numero di telefono; email.
                <br /><br />
                Dettagli completi su ciascuna tipologia di Dati Personali raccolti sono forniti nelle sezioni dedicate di questa privacy policy o mediante specifici
                testi informativi visualizzati prima della raccolta dei Dati stessi.
                I Dati Personali possono essere liberamente forniti dall&rsquo;Utente o, nel caso di Dati di Utilizzo, raccolti automaticamente durante l&rsquo;uso di questa Applicazione.
                Se non diversamente specificato, tutti i Dati richiesti da questa Applicazione sono obbligatori. Se l’Utente rifiuta di comunicarli, potrebbe essere
                impossibile per questa Applicazione fornire il Servizio. Nei casi in cui questa Applicazione indichi alcuni Dati come facoltativi, gli Utenti sono liberi
                di astenersi dal comunicare tali Dati, senza che ciò abbia alcuna conseguenza sulla disponibilità del Servizio o sulla sua operatività.
                Gli Utenti che dovessero avere dubbi su quali Dati siano obbligatori sono incoraggiati a contattare il Titolare.
                L’eventuale utilizzo di Cookie - o di altri strumenti di tracciamento - da parte di questa Applicazione o dei titolari dei servizi terzi utilizzati da
                questa Applicazione ha la finalità di fornire il Servizio richiesto dall&rsquo;Utente, oltre alle
                ulteriori finalità descritte nel presente documento e nella <Link href='/cookie-policy' title="link alla pagina cookie policy del sito" target='_blank' className='text-primary'>Cookie Policy</Link>.
                <br /><br />
                L&rsquo;Utente si assume la responsabilità dei Dati Personali di terzi ottenuti, pubblicati o condivisi mediante questa Applicazione.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
				SEZIONE
			+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>Modalità e luogo del trattamento dei Dati raccolti</h4>
            <p className='text-sm'>
                <strong>Modalità di trattamento</strong>
                <br />
                Il Titolare adotta le opportune misure di sicurezza volte ad impedire l’accesso, la divulgazione, la modifica o la distruzione non autorizzate dei Dati Personali.
                Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con modalità organizzative e con logiche strettamente correlate alle finalità indicate.
                Oltre al Titolare, in alcuni casi, potrebbero avere accesso ai Dati altri soggetti coinvolti nell’organizzazione di questa Applicazione (personale amministrativo,
                commerciale, marketing, legali, amministratori di sistema) ovvero soggetti esterni (come fornitori di servizi tecnici terzi, corrieri postali, hosting provider,
                società informatiche, agenzie di comunicazione) nominati anche, se necessario, Responsabili del Trattamento da parte del Titolare.
                L’elenco aggiornato dei Responsabili potrà sempre essere richiesto al Titolare del Trattamento.
                <br /><br />
                <strong>Luogo</strong>
                <br />
                I Dati sono trattati presso le sedi operative del Titolare ed in ogni altro luogo in cui le parti coinvolte nel trattamento siano localizzate.
                Per ulteriori informazioni, contatta il Titolare.
                I Dati Personali dell’Utente potrebbero essere trasferiti in un paese diverso da quello in cui l’Utente si trova.
                Per ottenere ulteriori informazioni sul luogo del trattamento l’Utente può fare riferimento alla sezione relativa ai dettagli sul trattamento dei Dati Personali.
                <br /><br />
                <strong>Periodo di conservazione</strong>
                <br />
                Se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale
                sono stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli Utenti.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>Dettagli sul trattamento dei Dati Personali</h4>
            <p className='text-sm'>I Dati Personali sono raccolti per le seguenti finalità ed utilizzando i seguenti servizi:</p>
            <div className='grid lg:grid-cols-2 gap-4 mt-4'>
                {settings.form && (
                    <div className="border rounded-md p-4">
                        <h4 className='text-primary text-lg'>Contattare l&rsquo;utente</h4>
                        <p className="text-sm mt-4">
                            <strong>Modulo di contatto (questa Applicazione)</strong>
                            <br />
                            L’Utente, compilando con i propri Dati il modulo di contatto, acconsente al loro utilizzo per rispondere alle richieste di informazioni,
                            di preventivo, o di qualunque altra natura indicata dall’intestazione del modulo.
                            Dati Personali trattati: cognome; email; nome; numero di telefono.
                        </p>
                    </div>
                )}
                {settings.analitycs && (
                    <div className="border rounded-md p-4">
                        <h4 className='text-primary text-lg'>Statistica</h4>
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
                            – <Link rel="nofollow" title="link alla pagina privacy di google analytics" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link> &nbsp;
                            – <Link rel="nofollow" title="link alla pagina privacy di google analytics" href="https://tools.google.com/dlpage/gaoptout?hl=it" className='text-primary' target='_blank'>Opt Out</Link>; &nbsp;
                            Irlanda
                            – <Link rel="nofollow" title="link alla pagina privacy di google analytics" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link> &nbsp;
                            – <Link rel="nofollow" title="link alla pagina privacy di google analytics" href="https://tools.google.com/dlpage/gaoptout?hl=it" className='text-primary' target='_blank'>Opt Out</Link>.
                        </p>
                    </div>
                )}
                {settings.font && (
                    <div className="border rounded-md p-4">
                        <h4 className='text-primary text-lg'>Visualizzazione di contenuti da piattaforme esterne</h4>
                        <p className="text-sm mt-4">
                            Questo tipo di servizi permette di visualizzare contenuti ospitati su piattaforme esterne direttamente dalle pagine di questa
                            Applicazione e di interagire con essi. Tali servizi sono spesso definiti widget, ovvero piccoli elementi inseriti in un sito web
                            o in un&rsquo;applicazione. Forniscono informazioni specifiche o svolgono una funzione particolare e spesso consentono l&rsquo;interazione con l&rsquo;utente.
                            Questo tipo di servizio potrebbe comunque raccogliere dati sul traffico web relativo alle pagine dove il servizio è installato,
                            anche quando gli utenti non lo utilizzano.
                            <br /><br />
                            <strong>Google Fonts</strong>
                            <br />
                            Google Fonts è un servizio di visualizzazione di stili di carattere gestito da Google LLC oppure da Google Ireland Limited, a seconda di
                            come il Titolare gestisce il trattamento dei Dati, che permette a questa Applicazione di integrare tali contenuti all’interno delle proprie pagine.
                            <br /><br />
                            Dati Personali trattati: Dati di utilizzo; Strumenti di Tracciamento.
                            <br /><br />
                            Luogo del trattamento: Stati Uniti – <Link rel="nofollow" title="link alla pagina privacy di google fonts" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link>
                            <br />
                            Irlanda – <Link rel="nofollow" title="link alla pagina privacy di google fonts" href="https://policies.google.com/privacy" className='text-primary' target='_blank'>Privacy Policy</Link>
                        </p>
                    </div>
                )}
            </div>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>Cookie</h4>
            <p className='text-sm'>
                Questa Applicazione fa utilizzo di Strumenti di Tracciamento. Per saperne di più, gli Utenti possono
                consultare la <Link title="link alla pagina cookie policy del sito" href='/cookie-policy' target='_blank' className='text-primary'>Cookie Policy</Link>.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className='text-primary text-lg mb-4'>Ulteriori informazioni per gli utenti</h4>
            <p className='text-sm'>
                <strong>Base giuridica del trattamento</strong>
                <br />
                Il Titolare tratta Dati Personali relativi all’Utente in caso sussista una delle seguenti condizioni:
                <br /><br />
            </p>
            <ul className="text-sm list-disc mb-4">
                <li className='ml-4 mb-3'>
                    l’Utente ha prestato il consenso per una o più finalità specifiche; Nota: in alcuni ordinamenti il Titolare può essere autorizzato a trattare Dati
                    Personali senza che debba sussistere il consenso dell’Utente o un’altra delle basi giuridiche specificate di seguito, fino a quando
                    l’Utente non si opponga (“opt-out”) a tale trattamento. Ciò non è tuttavia applicabile qualora il trattamento di Dati Personali sia
                    regolato dalla legislazione europea in materia di protezione dei Dati Personali;
                </li>
                <li className="ml-4 mb-3">
                    il trattamento è necessario all&rsquo;esecuzione di un contratto con l’Utente e/o all&rsquo;esecuzione di misure precontrattuali;
                </li>
                <li className="ml-4 mb-3">
                    il trattamento è necessario per adempiere un obbligo legale al quale è soggetto il Titolare;
                </li>
                <li className="ml-4 mb-3">
                    il trattamento è necessario per l&rsquo;esecuzione di un compito di interesse pubblico o per l&rsquo;esercizio di pubblici poteri di cui è investito il Titolare;
                </li>
                <li className="ml-4">
                    il trattamento è necessario per il perseguimento del legittimo interesse del Titolare o di terzi.
                </li>
            </ul>
            <p className="text-sm">
                È comunque sempre possibile richiedere al Titolare di chiarire la concreta base giuridica di ciascun trattamento ed in particolare di specificare
                se il trattamento sia basato sulla legge, previsto da un contratto o necessario per concludere un contratto.
                <br /><br />
                <strong>Ulteriori informazioni sul tempo di conservazione</strong>
                <br />
                Se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale
                sono stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli Utenti.
                Pertanto:
                <br /><br />
            </p>
            <ul className="text-sm list-disc mb-4">
                <li className="ml-4 mb-3">
                    I Dati Personali raccolti per scopi collegati all’esecuzione di un contratto tra il Titolare e l’Utente saranno trattenuti sino
                    a quando sia completata l’esecuzione di tale contratto.
                </li>
                <li className="ml-4">
                    I Dati Personali raccolti per finalità riconducibili all’interesse legittimo del Titolare saranno trattenuti sino al soddisfacimento di tale interesse.
                    L’Utente può ottenere ulteriori informazioni in merito
                    all’interesse legittimo perseguito dal Titolare nelle relative sezioni di questo documento o contattando il Titolare.
                </li>
            </ul>
            <p className="text-sm">
                Quando il trattamento è basato sul consenso dell’Utente, il Titolare può conservare i Dati Personali più a lungo sino a quando detto consenso non venga revocato.
                Inoltre, il Titolare potrebbe essere obbligato a conservare i Dati Personali per un periodo più lungo in ottemperanza ad un obbligo di legge o per ordine di un’autorità.
                <br /><br />
                Al termine del periodo di conservazione i Dati Personali saranno cancellati. Pertanto, allo spirare di tale termine il diritto di accesso, cancellazione,
                rettificazione ed il diritto alla portabilità dei Dati non potranno più essere esercitati.
                <br /><br />
                <strong>Diritti dell’Utente</strong>
                <br />
                Gli Utenti possono esercitare determinati diritti con riferimento ai Dati trattati dal Titolare.
                <br />
                In particolare, nei limiti previsti dalla legge, l’Utente ha il diritto di:
                <br /><br />
            </p>
            <ul className="text-sm list-disc mb-4">
                <li className="ml-4 mb-3">
                    revocare il consenso in ogni momento. L’Utente può revocare il consenso al trattamento dei propri Dati Personali precedentemente espresso.
                </li>
                <li className="ml-4 mb-3">
                    opporsi al trattamento dei propri Dati. L’Utente può opporsi al trattamento dei propri Dati quando esso avviene in virtù di una
                    base giuridica diversa dal consenso.
                </li>
                <li className="ml-4 mb-3">
                    accedere ai propri Dati. L’Utente ha diritto ad ottenere informazioni sui Dati trattati dal Titolare, su determinati aspetti del trattamento
                    ed a ricevere una copia dei Dati trattati.
                </li>
                <li className="ml-4 mb-3">
                    verificare e chiedere la rettificazione. L’Utente può verificare la correttezza dei propri Dati e richiederne l’aggiornamento o la correzione.
                </li>
                <li className="ml-4 mb-3">
                    ottenere la limitazione del trattamento. L’Utente può richiedere la limitazione del trattamento dei propri Dati.
                    In tal caso il Titolare non tratterà i Dati per alcun altro scopo se non la loro conservazione.
                </li>
                <li className="ml-4 mb-3">
                    ottenere la cancellazione o rimozione dei propri Dati Personali.
                    L’Utente può richiedere la cancellazione dei propri Dati da parte del Titolare.
                </li>
                <li className="ml-4 mb-3">
                    ricevere i propri Dati o farli trasferire ad altro titolare. L’Utente ha diritto di ricevere i propri Dati in formato strutturato, di uso comune e
                    leggibile da dispositivo automatico e, ove tecnicamente fattibile, di ottenerne il trasferimento senza ostacoli ad un altro titolare.
                </li>
                <li className="ml-4">
                    proporre reclamo. L’Utente può proporre un reclamo all’autorità di controllo della protezione dei dati personali competente o agire in sede giudiziale.
                </li>
            </ul>
            <p className="text-sm">
                Gli Utenti hanno diritto di ottenere informazioni in merito alla base giuridica per il trasferimento di Dati all&rsquo;estero incluso verso qualsiasi
                organizzazione internazionale regolata dal diritto internazionale o costituita da due o più paesi, come ad esempio l’ONU, nonché in
                merito alle misure di sicurezza adottate dal Titolare per proteggere i loro Dati.
                <br /><br />
                <strong>Dettagli sul diritto di opposizione</strong>
                <br />
                Quando i Dati Personali sono trattati nell’interesse pubblico, nell’esercizio di pubblici poteri di cui è investito il Titolare oppure per
                perseguire un interesse legittimo del Titolare, gli Utenti hanno diritto ad opporsi al trattamento per motivi connessi alla loro situazione particolare.
                <br /><br />
                Si fa presente agli Utenti che, ove i loro Dati fossero trattati con finalità di marketing diretto, possono opporsi al trattamento in qualsiasi momento,
                gratuitamente e senza fornire alcuna motivazione. Qualora gli Utenti si oppongano al trattamento per finalità di marketing diretto,
                i Dati Personali non sono più oggetto di trattamento per tali finalità. Per scoprire se il Titolare tratti Dati con finalità di marketing
                diretto gli Utenti possono fare riferimento alle rispettive sezioni di questo documento.
                <br /><br />
                <strong>Come esercitare i diritti</strong>
                <br />
                Per esercitare i propri diritti, gli Utenti possono indirizzare una richiesta ai recapiti del Titolare indicati in questo documento.
                La richiesta è gratuita e il Titolare risponderà nel più breve tempo possibile, in ogni caso entro un mese, fornendo all’Utente tutte le informazioni previste dalla legge.
                Eventuali rettifiche, cancellazioni o limitazioni del trattamento saranno comunicate dal Titolare a ciascuno dei destinatari, se esistenti, a cui sono stati
                trasmessi i Dati Personali, salvo che ciò si riveli impossibile o implichi uno sforzo sproporzionato.
                Il Titolare comunica all&rsquo;Utente tali destinatari qualora egli lo richieda.
            </p>
            <hr className='my-6' />

            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                SEZIONE
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

            <h4 className="text-primary text-lg mb-4">Ulteriori informazioni sul trattamento</h4>
            <p className="text-sm">
                <strong>Difesa in giudizio</strong>
                <br />
                I Dati Personali dell’Utente possono essere utilizzati da parte del Titolare in giudizio o nelle fasi preparatorie alla sua eventuale
                instaurazione per la difesa da abusi nell&rsquo;utilizzo di questa Applicazione o dei Servizi connessi da parte dell’Utente.
                L’Utente dichiara di essere consapevole che il Titolare potrebbe essere obbligato a rivelare i Dati per ordine delle autorità pubbliche.
                <br /><br />
                <strong>Informative specifiche</strong>
                <br />
                Su richiesta dell’Utente, in aggiunta alle informazioni contenute in questa privacy policy, questa Applicazione potrebbe fornire all&rsquo;Utente
                delle informative aggiuntive e contestuali riguardanti Servizi specifici, o la raccolta ed il trattamento di Dati Personali.
                <br /><br />
                <strong>Log di sistema e manutenzione</strong>
                <br />
                Per necessità legate al funzionamento ed alla manutenzione, questa Applicazione e gli eventuali servizi terzi da essa utilizzati potrebbero
                raccogliere log di sistema, ossia file che registrano le interazioni e che possono contenere anche Dati Personali, quali l’indirizzo IP Utente.
                <br /><br />
                <strong>Informazioni non contenute in questa policy</strong>
                <br />
                Ulteriori informazioni in relazione al trattamento dei Dati Personali potranno essere richieste in qualsiasi momento al Titolare
                del Trattamento utilizzando gli estremi di contatto.
                <br /><br />
                <strong>Modifiche a questa privacy policy</strong>
                <br />
                Il Titolare del Trattamento si riserva il diritto di apportare modifiche alla presente privacy policy in qualunque momento notificandolo
                agli Utenti su questa pagina e, se possibile, su questa Applicazione nonché, qualora tecnicamente e legalmente fattibile, inviando una notifica
                agli Utenti attraverso uno degli estremi di contatto di cui è in possesso. Si prega dunque di consultare con frequenza questa pagina, facendo
                riferimento alla data di ultima modifica indicata in fondo.
                <br /><br />
                Qualora le modifiche interessino trattamenti la cui base giuridica è il consenso, il Titolare provvederà a raccogliere nuovamente
                il consenso dell’Utente, se necessario.
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