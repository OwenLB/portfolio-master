<script lang="ts" setup>
import type {Experience, SubExperience} from "~/types/experience";
import {Lang} from "~/types/lang";

const props = defineProps<{
  experience: Experience
}>()

const lang = useLang()
const expanded = ref(false)
const expandedSubs = reactive<Record<number, boolean>>({})

const labels = computed(() => lang.value === Lang.Fr ? {
  responsibilities: 'Responsabilités',
  team: 'Équipe',
  results: 'Résultats',
  expand: 'Voir les détails',
  collapse: 'Réduire les détails',
} : {
  responsibilities: 'Responsibilities',
  team: 'Team',
  results: 'Results',
  expand: 'Show details',
  collapse: 'Hide details',
})

const hasDetails = (exp: Partial<Pick<Experience, 'responsibilities' | 'team' | 'results'>>) =>
    !!(exp.responsibilities?.length || exp.team || exp.results?.length)
</script>

<template>
  <div class="experience">
    <div class="experience__header">
      <h3>{{ experience.position }}</h3>
      <div class="experience__stack">
        <div v-for="stack in experience.stack" :key="stack.name">
          <img :src="`/icons/${stack.icon}.svg`" :alt="stack.name"/>
          <span>{{ stack.name }}</span>
        </div>
      </div>
    </div>
    <div class="experience__infos">
      <span>{{ experience.company }}</span>
      <hr>
      <span>{{ experience.type }}</span>
      |
      <div class="experience__dates">
        <span>{{ experience.from }}</span>
        <hr>
        <span>{{ experience.to }}</span>
        <span>{{ experience.duration }}</span>
      </div>
    </div>
    <div v-if="experience.content" class="experience__content">
      <span>{{ experience.content }}</span>
    </div>

    <template v-if="hasDetails(experience)">
      <button class="experience__toggle" :aria-label="expanded ? labels.collapse : labels.expand" :aria-expanded="expanded" @click="expanded = !expanded">
        <svg :class="{ rotated: expanded }" fill="none" height="12" viewBox="0 0 12 12" width="12"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"/>
        </svg>
      </button>
      <div :class="{ 'is-expanded': expanded }" class="experience__details-wrapper">
        <div class="experience__details">
          <template v-if="experience.responsibilities?.length">
            <p class="details-label">{{ labels.responsibilities }}</p>
            <ul>
              <li v-for="r in experience.responsibilities" :key="r">{{ r }}</li>
            </ul>
          </template>
          <template v-if="experience.team">
            <p class="details-label">{{ labels.team }}</p>
            <p>{{ experience.team }}</p>
          </template>
          <template v-if="experience.results?.length">
            <p class="details-label">{{ labels.results }}</p>
            <ul>
              <li v-for="r in experience.results" :key="r">{{ r }}</li>
            </ul>
          </template>
        </div>
      </div>
    </template>

    <div class="experience__sub__content">
      <div v-for="(sub, i) in experience.sub_content" :key="i" class="sub__experience">
        <div class="experience__header">
          <h3>{{ sub.position }}</h3>
          <div class="experience__stack">
            <div v-for="stack in sub.stack" :key="stack.name">
              <img :src="`/icons/${stack.icon}.svg`" :alt="stack.name"/>
              <span>{{ stack.name }}</span>
            </div>
          </div>
        </div>
        <div class="experience__infos">
          <span>{{ sub.type }} — {{ sub.company }}</span>
          |
          <div class="experience__dates">
            <span>{{ sub.from }}</span>
            <hr>
            <span>{{ sub.to }}</span>
            <span>{{ sub.duration }}</span>
          </div>
        </div>
        <div class="experience__content">
          <span>{{ sub.content }}</span>
        </div>

        <template v-if="hasDetails(sub)">
          <button class="experience__toggle" :aria-label="expandedSubs[i] ? labels.collapse : labels.expand" :aria-expanded="expandedSubs[i] ?? false" @click="expandedSubs[i] = !expandedSubs[i]">
            <svg :class="{ rotated: expandedSubs[i] }" fill="none" height="12" viewBox="0 0 12 12" width="12"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.5"/>
            </svg>
          </button>
          <div :class="{ 'is-expanded': expandedSubs[i] }" class="experience__details-wrapper">
            <div class="experience__details">
              <template v-if="sub.responsibilities?.length">
                <p class="details-label">{{ labels.responsibilities }}</p>
                <ul>
                  <li v-for="r in sub.responsibilities" :key="r">{{ r }}</li>
                </ul>
              </template>
              <template v-if="sub.team">
                <p class="details-label">{{ labels.team }}</p>
                <p>{{ sub.team }}</p>
              </template>
              <template v-if="sub.results?.length">
                <p class="details-label">{{ labels.results }}</p>
                <ul>
                  <li v-for="r in sub.results" :key="r">{{ r }}</li>
                </ul>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.experience {
  padding-top: space(2);
  display: flex;
  flex-direction: column;
  gap: space(2);

  @media screen and (max-width: $md) {
    width: 295px;
  }

  .experience__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .experience__stack {
      display: flex;
      gap: space(2);
      flex-wrap: wrap;

      @media screen and (max-width: $md) {
        margin: 8px 0;
      }

      div {
        display: flex;
        align-items: center;
        padding: 0 12px;
        height: 36px;
        border: 1px solid var(--accent);
        border-radius: 32px;
        font-size: 0.8rem;
        @include transition(border, padding, width);

        img {
          height: 0;
          width: auto;
          opacity: 0;
          transform: translateX(-10px) scale(0.8);
          @include transition(opacity 0.3s ease-out, transform 0.3s ease-out);
        }

        &:where(:hover, :focus, :focus-visible) {
          border: 1px solid var(--primary);
          outline: none;
          padding-right: 20px;

          img {
            height: 20px;
            margin-right: 8px;
            opacity: 1;
            transform: translateX(0) scale(1);
            animation: bounceIn 0.4s ease-out;
          }
        }
      }
    }
  }

  @keyframes bounceIn {
    0% { transform: translateX(-10px) scale(0.8); opacity: 0; }
    50% { transform: translateX(2px) scale(1.05); }
    100% { transform: translateX(0) scale(1); opacity: 1; }
  }

  &:hover {
    > .experience__details-wrapper {
      grid-template-rows: 1fr;
    }
    > .experience__toggle svg {
      transform: rotate(180deg);
    }
  }

  .sub__experience {
    border-bottom: 1px solid var(--accent);
    display: flex;
    flex-direction: column;
    gap: space(2);
    padding: 12px 0;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:hover {
      > .experience__details-wrapper {
        grid-template-rows: 1fr;
      }
      > .experience__toggle svg {
        transform: rotate(180deg);
      }
    }
  }

  .experience__sub__content {
    padding-left: space(6);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--accent);
    padding-bottom: space(6);
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 500;
  }

  &__infos, &__dates {
    display: flex;
    align-items: center;
    gap: space(2);
    flex-wrap: wrap;

    hr {
      height: 1px;
      margin: 0;
      border: none;
    }
  }

  &__infos {
    hr {
      width: space(2);
      background: var(--text);
    }
  }

  &__dates {
    font-size: 0.875rem;
    color: var(--text-accent);

    hr {
      width: space(4);
      background: var(--text-accent);
    }
  }

  &__toggle {
    all: unset;
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    padding: space(3) 0;
    color: var(--accent);
    @include transition(color);

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: currentColor;
    }

    svg {
      margin: 0 space(4);
      flex-shrink: 0;
      transition: transform 0.35s ease;
      &.rotated { transform: rotate(180deg); }
    }

    &:hover { color: var(--primary); }
  }

  &__details-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s ease;

    &.is-expanded {
      grid-template-rows: 1fr;
    }
  }

  &__details {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: space(3);
    padding-top: space(3);

    .details-label {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: space(1);
    }

    ul {
      gap: space(2);

      li {
        font-size: 0.875rem;
        line-height: 1.5rem;

        &:before {
          width: space(2);
          background: var(--text-accent);
        }
      }
    }

    p:not(.details-label) {
      font-size: 0.875rem;
      line-height: 1.5rem;
      color: var(--text);
    }
  }
}
</style>
