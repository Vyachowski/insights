const TOOLS = /claude|copilot|cursor|chatgpt|openai|gpt-\d|gemini|codex|devin|aider/i

const AI_ATTRIBUTION = [
  [new RegExp(`^\\s*co-authored-by:.*(${TOOLS.source})`, 'im'), 'a Co-Authored-By trailer naming a tool'],
  [new RegExp(`generated (with|by).*(${TOOLS.source})`, 'im'), 'a generated-with footer'],
  [/🤖/u, 'the robot emoji'],
]

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        // The conventional rules only look at the header, so trailers pass them
        'no-ai-attribution': ({ raw }) => {
          const found = AI_ATTRIBUTION
            .filter(([pattern]) => pattern.test(raw ?? ''))
            .map(([, description]) => description)

          return [found.length === 0, `remove ${found.join(' and ')} from the commit message`]
        },
      },
    },
  ],
  rules: {
    'no-ai-attribution': [2, 'always'],
  },
}
