import { it, expect, describe } from 'vitest'
import { getPossibleCountriesByCallingCode } from './getPossibleCountriesByCallingCode'

describe('getPossibleCountriesByCallingCode', () => {
  it('Should return empty array if the value is invalid', () => {
    expect(getPossibleCountriesByCallingCode('')).toEqual([])
    // @ts-ignore
    expect(getPossibleCountriesByCallingCode(undefined)).toEqual([])
  })

  it('Should return empty array if no country was found', () => {
    expect(getPossibleCountriesByCallingCode('9')).toEqual([])
  })

  it('Should return correct possible country which matches one character', () => {
    expect(getPossibleCountriesByCallingCode('7')).toEqual(['RU', 'KZ'])
  })

  it('Should return correct possible country which matches two characters', () => {
    expect(getPossibleCountriesByCallingCode('36')).toEqual(['HU'])
  })

  it('Should return correct possible country which matches three characters', () => {
    expect(getPossibleCountriesByCallingCode('996')).toEqual(['KG'])
  })
})
