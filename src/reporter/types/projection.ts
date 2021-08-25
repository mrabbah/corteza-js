import { reporter } from '../..'
import { Apply } from '../../cast'
import { AreObjectsOf } from '../../guards'
import { DisplayElement, DisplayElementMaker } from './display-elements'

const defaultXYWH: () => [number, number, number, number] = () => [0, 0, 20, 15]

export class Projection {
  public title = ''
  public description = ''
  public layout = 'horizontal'
  public elements: Array<DisplayElement> = []

  public sources: Array<reporter.Step> = []

  xywh: number[] = defaultXYWH()

  constructor (p: Partial<Projection>) {
    if (!p) return

    Apply(this, p, String, 'title', 'description', 'layout')

    if (p.xywh) {
      if (!Array.isArray(p.xywh)) {
        throw new Error('xywh must be an array')
      }

      if (p.xywh.length !== 4) {
        throw new Error('xywh must have 4 elements')
      }

      this.xywh = p.xywh
    }

    if (p.elements) {
      this.elements = []
      if (AreObjectsOf<DisplayElement>(p.elements, 'kind')) {
        this.elements = p.elements.map((e: { kind: string }) => DisplayElementMaker(e))
      }
    }

    this.sources = []

    for (const s of p.sources || []) {
      this.sources.push(s as reporter.Step)
    }
  }
}
