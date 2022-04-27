// Loads the Sitecore CDP library and creates useEffect to track all page views

import Script from 'next/script';
import { useEffect } from 'react';

declare const _boxeverq: any;
declare const Boxever: any;

function createPageView(routeName: string) {
  const pointOfSale = process.env.NEXT_PUBLIC_POINT_OF_SALE;

  _boxeverq.push(function () {
    const pageViewEvent = {
      browser_id: Boxever.getID(),
      browserId: Boxever.getID(),
      channel: 'WEB',
      type: 'VIEW',
      language: 'EN',
      page: routeName,
      pos: pointOfSale,
    };

    Boxever.eventCreate(pageViewEvent, function() {}, 'json');
  });
}

interface CdpIntegrationProps {
  route: string;
}

const CdpIntegrationScript = (props: CdpIntegrationProps): JSX.Element => {
  const clientKey = process.env.NEXT_PUBLIC_CDP_CLIENT_KEY;
  const pointOfSale = process.env.NEXT_PUBLIC_POINT_OF_SALE;


  useEffect(() => {
    createPageView(props.route);
  });

  return (
    <>
      <Script
        id="cdp_settings"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
          var _boxeverq = _boxeverq || []; var _boxever_settings = {}; 
          
          _boxever_settings.client_key="${clientKey}"; 
          _boxever_settings.target="https://api.boxever.com/v1.2"; 
          _boxever_settings.cookie_domain="";
          _boxever_settings.pointOfSale="${pointOfSale}";
            `,
        }}
      />
      <Script src="https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.8.min.js" />
    </>
  );
};

export default CdpIntegrationScript;