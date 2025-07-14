import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate id="homepage.hero.title" description="The hero title on homepage">
            PyServe
          </Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline" description="The tagline for PyServe homepage">
            Lightweight and Fast HTTP Server in Python
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            <Translate id="homepage.hero.getStarted">
              Get Started - 5min ⏱️
            </Translate>
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://github.com/ShiftyX1/PyServe">
            <Translate id="homepage.hero.viewGitHub">
              View on GitHub
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        id: 'homepage.title',
        message: 'PyServe - Lightweight HTTP Server',
        description: 'The page title for the homepage'
      })}
      description={translate({
        id: 'homepage.description',
        message: "PyServe is a lightweight and fast HTTP server written in Python for quick deployment and serving static files",
        description: 'The page description for the homepage'
      })}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
