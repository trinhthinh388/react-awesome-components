import nextra from 'nextra'
import remarkMdxDisableExplicitJsx from 'remark-mdx-disable-explicit-jsx'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  flexsearch: {
    codeblocks: false
  },
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [
      [
        remarkMdxDisableExplicitJsx,
        { whiteList: ['table', 'thead', 'tbody', 'tr', 'th', 'td'] }
      ]
    ]
  }
})

export default withNextra({
  reactStrictMode: true,
  eslint: {
    // ESLint behaves weirdly in this monorepo.
    ignoreDuringBuilds: true
  }
})
