
import Script from 'next/script';
import { useEffect } from 'react';

declare const _boxeverq: { (): void }[];
declare const Boxever: Boxever;

interface Boxever {
  getID(): string;
  eventCreate(data: BoxeverViewEventArgs, callback: () => void, format: string): void;
}

interface BoxeverViewEventArgs {
  browser_id: string;
  channel: string;
  type: string;
  language: string;
  page: string;
  pos: string;
}

function createPageView(routeName: string) {
  // POS must be valid in order to save events (domain name might be taken but it must be defined in CDP settings)
 // const pointOfSale = process.env.NEXT_PUBLIC_POINT_OF_SALE || window.location.host.replace(/^www\./, '');
  const pointOfSale = process.env.NEXT_PUBLIC_POINT_OF_SALE;

  _boxeverq.push(function () {
    const pageViewEvent: BoxeverViewEventArgs = {
      browser_id: Boxever.getID(),
      channel: 'WEB',
      type: 'VIEW',
      language: "EN",
      page: routeName,
      pos: "carb-overlayteam",
    };

    Boxever.eventCreate(
      pageViewEvent,
      function () {
        /*empty callback*/
      },
      'json'
    );
  });
}

const CdpIntegrationScript = (): JSX.Element => {

  useEffect(() => {
    console.log("home");
    createPageView("home");
  });

  return (
    <>
      <Script
        id="cdp_settings"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
              var _boxeverq = _boxeverq || [];
              var _boxever_settings = {
                  client_key: '${process.env.NEXT_PUBLIC_CDP_CLIENT_KEY}',
                  target: '${process.env.NEXT_PUBLIC_CDP_TARGET_URL}',
                  cookie_domain: ''
              };
            `,
        }}
      />
      <Script src={process.env.NEXT_PUBLIC_CDP_SCRIPT_URL} />
    </>
  );
};

export default CdpIntegrationScript;