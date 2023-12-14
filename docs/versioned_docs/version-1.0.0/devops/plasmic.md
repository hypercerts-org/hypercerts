# Plasmic setup

## HypercertImage

### Props

hideImpact

```
$ctx.currentForm.impactTimeEnd === "indefinite" && ($ctx.currentForm.impactScopes.length === 0 || ($ctx.currentForm.impactScopes.length === 1 && $ctx.currentForm.impactScopes[0] === "all"))
```

color

```
$ctx.currentForm.backgroundColor
```

vectorart

```
$ctx.currentForm.backgroundVectorArt
```

### Slots

logoImage Image URL

```
$ctx.currentForm.logoUrl
```

title Content

```
$ctx.currentForm.name
```

workPeriod Content

```
`${$ctx.currentForm.workTimeStart.format ? $ctx.currentForm.workTimeStart.format("YYYY-MM-DD") : $ctx.currentForm.workTimeStart} → ${$ctx.currentForm.workTimeEnd.format ? $ctx.currentForm.workTimeEnd.format("YYYY-MM-DD") : $ctx.currentForm.workTimeEnd}`
```

bannerImage Image URL

```
$ctx.currentForm.bannerUrl
```

impactPeriod Content

```
`${$ctx.currentForm.workTimeStart.format ? $ctx.currentForm.workTimeStart.format("YYYY-MM-DD") : $ctx.currentForm.workTimeStart} → ${$ctx.currentForm.impactTimeEnd.format ? $ctx.currentForm.impactTimeEnd.format("YYYY-MM-DD") : $ctx.currentForm.impactTimeEnd}`
```

#### workScopes: repeated ScopeChip

Collection

```
$ctx.currentForm.workScopes.split(/[,\n]/).map(i => i.trim()).filter(i => !!i)
```

Element name: `currentWorkScope`
Index name: `currentIndex`
Color variant: `$ctx.currentForm.backgroundColor`
Content: `currentWorkScope`

#### impactScopes: repeated ScopeChip

Collection: `$ctx.currentForm.impactScopes`
Element name: `currentImpactScope`
Index name: `currentIndex`
Color variant: `$ctx.currentForm.backgroundColor`
Content: `currentImpactScope`
