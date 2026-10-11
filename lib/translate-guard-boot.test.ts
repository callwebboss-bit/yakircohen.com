import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vm from "node:vm";
import { TRANSLATE_GUARD_BOOT_SCRIPT } from "@/lib/translate-guard-boot";

/* DOM מינימלי: מספיק כדי לבדוק שהעטיפה זורקת כרגיל בלי תרגום, ובולעת רק
   כש-<html> מסומן כמתורגם */
function setup(translatedClass: string | null) {
  const classes = new Set(translatedClass ? [translatedClass] : []);
  class Node {
    parentNode: Node | null = null;
    removeChild(child: Node): Node {
      if (child.parentNode !== this) throw new Error("NotFoundError");
      child.parentNode = null;
      return child;
    }
    insertBefore(node: Node, ref: Node | null): Node {
      if (ref && ref.parentNode !== this) throw new Error("NotFoundError");
      node.parentNode = this;
      return node;
    }
  }
  const document = { documentElement: { classList: { contains: (c: string) => classes.has(c) } } };
  vm.runInNewContext(TRANSLATE_GUARD_BOOT_SCRIPT, { Node, document });
  return Node;
}

describe("translate guard boot script", () => {
  it("still throws on a detached node when the page is not translated", () => {
    const Node = setup(null);
    const parent = new Node();
    const stray = new Node();
    assert.throws(() => parent.removeChild(stray), /NotFoundError/);
    assert.throws(() => parent.insertBefore(new Node(), stray), /NotFoundError/);
  });

  for (const cls of ["translated-ltr", "translated-rtl"]) {
    it(`swallows the error when Chrome marked the page ${cls}`, () => {
      const Node = setup(cls);
      const parent = new Node();
      const stray = new Node();
      assert.equal(parent.removeChild(stray), stray);
      const added = new Node();
      assert.equal(parent.insertBefore(added, stray), added);
    });
  }

  it("keeps normal behavior for nodes that are in place", () => {
    const Node = setup("translated-ltr");
    const parent = new Node();
    const child = parent.insertBefore(new Node(), null);
    assert.equal(child.parentNode, parent);
    assert.equal(parent.removeChild(child), child);
    assert.equal(child.parentNode, null);
  });
});
