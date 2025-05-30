<script lang="ts" setup>
import {Experience} from "~/types/experience";

const props = defineProps<{
  experience: Experience
}>()
</script>

<template>
  <div class="experience">
    <div class="experience__header">
      <h3>{{ experience.position }}</h3>
      <div class="experience__stack">
        <div v-for="stack in experience.stack" :key="stack.name">
          <img :src="`/icons/${stack.icon}.svg`" alt="stack icon"/>
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
    <div class="experience__content">
      <span>{{ experience.content }}</span>
    </div>
    <div class="experience__sub__content">
      <div v-for="sub in experience.sub_content" class="sub__experience">
        <div class="experience__header">
          <h3>{{ sub.position }}</h3>
          <div class="experience__stack">
            <div v-for="stack in sub.stack" :key="stack.name">
              <img :src="`/icons/${stack.icon}.svg`"/>
              <span>{{ stack.name }}</span>
            </div>
          </div>
        </div>
        <div class="experience__infos">
          <span>{{ sub.type }} {{ sub.company }}</span>
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
          padding-right: 20px; // Permet d'ajuster la taille avec douceur

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

  // Animation de rebond subtil à l'apparition
  @keyframes bounceIn {
    0% {
      transform: translateX(-10px) scale(0.8);
      opacity: 0;
    }
    50% {
      transform: translateX(2px) scale(1.05);
    }
    100% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }

  .sub__experience {
    border-bottom: 1px solid var(--accent);
    display: flex;
    flex-direction: column;
    gap: space(2);
    padding: 12px 0 12px 0;


    &:last-child {
      border-bottom: none;
      padding: 12px 0 0 0;

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
}
</style>