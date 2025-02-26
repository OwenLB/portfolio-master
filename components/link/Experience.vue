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
        <div>Techno 1</div>
        <div>Techno 1</div>
        <div>Techno 1</div>
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
      <div v-for="sub in experience.sub_content" class="sub-experience">
        <h4>{{ sub.position }} - {{ sub.company }}</h4>
        <div class="sub-experience__infos">
          <span>{{ sub.type }}</span>
          |
          <div class="sub-experience__dates">
            <span>{{ sub.from }}</span>
            <hr>
            <span>{{ sub.to }}</span>
            <span>{{ sub.duration }}</span>
          </div>
        </div>
        <div class="sub-experience__content">
          <span>{{ sub.content }}</span>
        </div>
      </div>
    </div>

	</div>
</template>

<style lang="scss" scoped>
.experience {
	display: flex;
	flex-direction: column;
	gap: space(2);

  .experience__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .experience__stack {
      display: flex;
      gap: space(2);

      div {
        background-color: #b9d0e8;
        color: #061423;
        padding: space(2);
        border-radius: 32px;
      }
    }
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