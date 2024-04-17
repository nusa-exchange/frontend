export const getColored = (state: string) => {
  state = state.toLowerCase();

  switch (state) {
    case 'pending':
    case 'processing':
    case 'wait':
    case 'submitted':
    case 'confirming':
    case 'accepted':
    case 'preparing':
    case 'refunding':
    case 'ongoing':
        return "color-blue"
    case 'draft':
        return "color-info"
    case 'active':
    case 'succeed':
    case 'done':
    case 'buy':
    case 'collected':
    case 'enabled':
    case 'verified':
    case 'executing':
    case 'completed':
    case 'distributing':
    case 'finished':
    case 'approved':
        return "color-up"
    default:
        return "color-down"
  }
}
