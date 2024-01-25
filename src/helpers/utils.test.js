// utils.test.js
import { formatDate, round, formatNumber, transparentize, getDateLabel } from './utils'
import i18n from './i18n'

describe("utils", () => {

  beforeEach(() => {
    
  })

  test('formatDate function should retrive correct value', () => {
    const dateNull = formatDate(null)
    expect(dateNull).toBeNull()
    const date = formatDate('2024-1-12 18:30', '')
    expect(date).toEqual('12/1/2024')
    const dateNoYear = formatDate('2024-1-12 18:30', 'noyear')
    expect(dateNoYear).toEqual('12/1')
    const dateTime = formatDate('2024-1-12 18:30', 'time')
    expect(dateTime).toEqual('12/1/2024 18:30')
  })

  test('round function should retrive correct value', () => {
    const roundNull = round(null)
    expect(roundNull).toBeNull()
    const roundNumber = round(1)
    expect(roundNumber).toEqual("1.0")
    const roundString = round("1")
    expect(roundString).toEqual("1.0")
    const roundCeroDecimals = round("1.4",0)
    expect(roundCeroDecimals).toEqual("1")
    const roundTwoDecimals = round("1.4",2)
    expect(roundTwoDecimals).toEqual("1.40")
  })

  test('formatNumber function should retrive correct value', () => {
    const formatNumberNull = formatNumber(null)
    expect(formatNumberNull).toBeNull()
    const formatNumberNumber = formatNumber(1)
    expect(formatNumberNumber).toEqual("1")
    const formatNumberString = formatNumber("1")
    expect(formatNumberString).toEqual("1")
    const formatNumberHundreds = formatNumber("100")
    expect(formatNumberHundreds).toEqual("100")
    const formatNumberThousands = formatNumber("1000")
    expect(formatNumberThousands).toEqual("1,000") 
  })

  test('transparentize function should retrive correct value', () => {
    const transparentizeNull = transparentize(null)
    expect(transparentizeNull).toBeNull()
    const transparentizeColor = transparentize('#f355b7')
    expect(transparentizeColor).toEqual("rgba(243, 85, 183, 0.5)")
    const transparentizeColor8 = transparentize('#f355b7',0.8)
    expect(transparentizeColor8).toEqual("rgba(243, 85, 183, 0.2)")
  })

  test('getDateLabel function should retrive correct value', () => {
    const getDateLabelNull = getDateLabel(null)
    expect(getDateLabelNull).toBeNull()
    const getDateLabelLastYear = getDateLabel('cy-1')
    expect(getDateLabelLastYear).toEqual("2023")
    const getDateLabelYesterday = getDateLabel('y')
    expect(getDateLabelYesterday).toEqual(i18n.t("Yesterday"))
    const getDateLabel30d = getDateLabel('30d')
    expect(getDateLabel30d).toEqual('30 '+i18n.t('days'))
    const getDateLabel12w = getDateLabel('12w')
    expect(getDateLabel12w).toEqual('12 '+i18n.t('weeks'))
    const getDateLabel12m = getDateLabel('12m')
    expect(getDateLabel12m).toEqual('12 '+i18n.t('month'))
    const getDateLabelcy = getDateLabel('cy')
    expect(getDateLabelcy).toEqual(i18n.t('Current year'))
    const getDateLabelcm = getDateLabel('cm')
    expect(getDateLabelcm).toEqual(i18n.t('Current month'))
    const getDateLabelcw = getDateLabel('cw')
    expect(getDateLabelcw).toEqual(i18n.t('Current week'))
    const getDateLabelx = getDateLabel('x')
    expect(getDateLabelx).toEqual(i18n.t('Custom range'))
    const getDateLabelxx = getDateLabel('xx','2024-4-14', '2024-5-25')
    expect(getDateLabelxx).toEqual('2024-4-14 - 2024-5-25')
    const getDateLabelOtherValue = getDateLabel('otherValue')
    expect(getDateLabelOtherValue).toEqual('otherValue')
  })


})