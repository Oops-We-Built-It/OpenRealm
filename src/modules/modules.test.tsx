import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import ForestModule from './Forest'
import ForgeModule from './Forge'

const walletAddress = '0x1111111111111111111111111111111111111111' as const

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

it('grows and harvests a Starlight Fruit from an interactive farm plot', async () => {
  vi.useFakeTimers()
  const onHarvestStarfruit = vi.fn()
  render(<ForestModule walletAddress={walletAddress} hasPassport unlocked onHarvestStarfruit={onHarvestStarfruit} />)

  fireEvent.click(screen.getByRole('button', { name: 'Plot 1: empty' }))
  fireEvent.click(screen.getByRole('button', { name: /Plant moonseed/ }))
  expect(screen.getByRole('button', { name: 'Plot 1: planted' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Water the sprout/ }))
  expect(screen.getByRole('button', { name: 'Plot 1: watered' })).toBeTruthy()

  await act(async () => { await vi.advanceTimersByTimeAsync(14_000) })
  expect(screen.getByRole('button', { name: /Harvest Starlight Fruit/ })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Harvest Starlight Fruit/ }))

  expect(onHarvestStarfruit).toHaveBeenCalledOnce()
  expect(screen.getByText('✦ Starlight Fruit gathered! A little starlight travels with you.')).toBeTruthy()
})

it('keeps Arena locked after purchase resolves until unlocked changes, then completes a duel', async () => {
  const onBuy = vi.fn<() => Promise<void>>().mockRejectedValueOnce(new Error('Rejected by wallet'))
  const props = { walletAddress, hasPassport: true, unlocked: false, hasStarfruit: true, onBuy }
  const view = render(<ForgeModule {...props} />)

  fireEvent.click(screen.getByRole('button', { name: '购买并解锁' }))
  expect(await screen.findByText('Rejected by wallet')).toBeTruthy()
  expect(screen.queryByRole('meter', { name: 'Gloomfang health' })).toBeNull()

  onBuy.mockResolvedValueOnce(undefined)
  fireEvent.click(screen.getByRole('button', { name: '购买并解锁' }))
  expect(await screen.findByText(/Waiting for the host to confirm/)).toBeTruthy()
  expect(screen.queryByRole('meter', { name: 'Gloomfang health' })).toBeNull()

  view.rerender(<ForgeModule {...props} unlocked />)
  fireEvent.click(screen.getByRole('button', { name: /Strike/ }))
  expect(screen.getByRole('meter', { name: 'Gloomfang health' }).getAttribute('aria-valuenow')).toBe('85')
  expect(screen.getByText(/Starlight Fruit empowered strike deals 15/)).toBeTruthy()
  for (let hit = 0; hit < 5; hit += 1) fireEvent.click(screen.getByRole('button', { name: /Runeburst/ }))
  expect(screen.getByText('✦ VICTORY ✦')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Fight again/ }))
  expect(screen.getByRole('meter', { name: 'Gloomfang health' }).getAttribute('aria-valuenow')).toBe('100')
})
