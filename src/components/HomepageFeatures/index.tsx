import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: ReactNode;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: (
      <Translate id="homepage.feature.quickStart.title">
        Quick Start
      </Translate>
    ),
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <Translate id="homepage.feature.quickStart.description">
        Launch the server with a single command and get to work.
        PyServe is designed for rapid deployment and minimal configuration.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.feature.staticFiles.title">
        Static Files
      </Translate>
    ),
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <Translate id="homepage.feature.staticFiles.description">
        Serve HTML, CSS, JavaScript and other static files efficiently.
        Perfect for hosting static websites, documentation, and web applications.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.feature.logging.title">
        Built-in Logging
      </Translate>
    ),
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <Translate id="homepage.feature.logging.description">
        Beautiful built-in logging of all requests with detailed information.
        Monitor your server activity with comprehensive request tracking.
      </Translate>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
