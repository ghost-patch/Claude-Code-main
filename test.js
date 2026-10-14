fetch('https://vyceai.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk-124f6fc41e3079f9b1b701ef3a4d228f5f4c1a0d53aa0fb5',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 100,
    messages: [{role: 'user', content: 'say hi'}]
  })
}).then(r => r.json()).then(console.log).catch(console.error)

