<template>
  <div class="modal micromodal-slide" id="modal-useredit" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1" data-micromodal-close>
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
        <header class="modal__header">
          <h2 class="modal__title" id="modal-1-title">Micromodal</h2>
          <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
        </header>
        <main class="modal__content" id="modal-1-content">
          <p>
            Try hitting the
            <code>tab</code> key and notice how the focus stays within the modal itself. Also,
            <code>esc</code> to close modal.
          </p>
        </main>
        <footer class="modal__footer">
          <button class="modal__btn modal__btn-primary">Continue</button>
          <button
            class="modal__btn"
            data-micromodal-close
            aria-label="Close this dialog window"
          >Close</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userdata"]
};
</script>

<style lang="scss" scoped>
$color_1: #00449e;
$color_2: rgba(0, 0, 0, 0.8);
$color_3: #fff;
$font_family_1: -apple-system, BlinkMacSystemFont, avenir next, avenir,
  helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
$background_color_1: #fff;
$background_color_2: #e6e6e6;
$background_color_3: #00449e;

@keyframes "mmfadeIn" {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes "mmfadeOut" {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes "mmslideIn" {
  from {
    transform: translateY(15%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes "mmslideOut" {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10%);
  }
}
.modal {
  font-family: $font_family_1;
}
.modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal__container {
  background-color: $background_color_1;
  padding: 30px;
  max-width: 500px;
  max-height: 100vh;
  border-radius: 4px;
  overflow-y: auto;
  box-sizing: border-box;
}
.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .modal__close {
    &:before {
      content: "\2715";
    }
  }
}
.modal__title {
  margin-top: 0;
  margin-bottom: 0;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.25;
  color: $color_1;
  box-sizing: border-box;
}
.modal__close {
  background: transparent;
  border: 0;
}
.modal__content {
  margin-top: 2rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  color: $color_2;
}
.modal__btn {
  font-size: 0.875rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: $background_color_2;
  color: $color_2;
  border-radius: 0.25rem;
  border-style: none;
  border-width: 0;
  cursor: pointer;
  -webkit-appearance: button;
  text-transform: none;
  overflow: visible;
  line-height: 1.15;
  margin: 0;
  will-change: transform;
  -moz-osx-font-smoothing: grayscale;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  transition: -webkit-transform 0.25s ease-out;
  transition: transform 0.25s ease-out;
  transition: transform 0.25s ease-out, -webkit-transform 0.25s ease-out;
  &:focus {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  &:hover {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
}
.modal__btn-primary {
  background-color: $background_color_3;
  color: $color_3;
}
.micromodal-slide {
  display: none;
  .modal__container {
    will-change: transform;
  }
  .modal__overlay {
    will-change: transform;
  }
}
.micromodal-slide.is-open {
  display: block;
}
.micromodal-slide[aria-hidden="false"] {
  .modal__overlay {
    animation: mmfadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
  .modal__container {
    animation: mmslideIn 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
}
.micromodal-slide[aria-hidden="true"] {
  .modal__overlay {
    animation: mmfadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
  .modal__container {
    animation: mmslideOut 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>