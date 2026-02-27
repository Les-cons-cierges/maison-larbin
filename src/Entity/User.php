<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(fields: ['email'], message: 'Cet email est déjà utilisé.')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[Assert\NotBlank(message: 'Le prénom est obligatoire.')]
    #[ORM\Column(length: 255)]
    private ?string $prenom = null;

    #[Assert\NotBlank(message: 'L’email est obligatoire.')]
    #[Assert\Email(message: 'Veuillez saisir un email valide.')]
    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;

    /**
     * @var Collection<int, Entreprise>
     */
    #[ORM\OneToMany(targetEntity: Entreprise::class, mappedBy: 'owner')]
    private Collection $entreprises;

    /**
     * @var Collection<int, Requete>
     */
    #[ORM\OneToMany(targetEntity: Requete::class, mappedBy: 'auteur')]
    private Collection $requetes;

    /**
     * @var Collection<int, Requete>
     */
    #[ORM\OneToMany(targetEntity: Requete::class, mappedBy: 'assignee')]
    private Collection $requetesAssignee;

    public function __construct()
    {
        $this->entreprises = new ArrayCollection();
        $this->requetes = new ArrayCollection();
        $this->requetesAssignee = new ArrayCollection();

        $now = new \DateTimeImmutable();
        $this->created_at = $now;
        $this->updated_at = $now;
        $this->roles = ['ROLE_USER'];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = trim($nom);

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = trim($prenom);

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = mb_strtolower(trim($email));

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_values(array_unique($roles));
    }

    public function setRoles(array $roles): static
    {
        $this->roles = array_values(array_unique($roles));

        return $this;
    }

    public function eraseCredentials(): void
    {
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    /**
     * @return Collection<int, Entreprise>
     */
    public function getEntreprises(): Collection
    {
        return $this->entreprises;
    }

    public function addEntreprise(Entreprise $entreprise): static
    {
        if (!$this->entreprises->contains($entreprise)) {
            $this->entreprises->add($entreprise);
            $entreprise->setOwner($this);
        }
 
        return $this;
    }

    public function removeEntreprise(Entreprise $entreprise): static
    {
        if ($this->entreprises->removeElement($entreprise)) {
            if ($entreprise->getOwner() === $this) {
                $entreprise->setOwner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Requete>
     */
    public function getRequetes(): Collection
    {
        return $this->requetes;
    }

    public function addRequete(Requete $requete): static
    {
        if (!$this->requetes->contains($requete)) {
            $this->requetes->add($requete);
            $requete->setAuteur($this);
        }

        return $this;
    }

    public function removeRequete(Requete $requete): static
    {
        if ($this->requetes->removeElement($requete)) {
            if ($requete->getAuteur() === $this) {
                $requete->setAuteur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Requete>
     */
    public function getRequetesAssignee(): Collection
    {
        return $this->requetesAssignee;
    }

    public function addRequetesAssignee(Requete $requetesAssignee): static
    {
        if (!$this->requetesAssignee->contains($requetesAssignee)) {
            $this->requetesAssignee->add($requetesAssignee);
            $requetesAssignee->setAssignee($this);
        }

        return $this;
    }

    public function removeRequetesAssignee(Requete $requetesAssignee): static
    {
        if ($this->requetesAssignee->removeElement($requetesAssignee)) {
            if ($requetesAssignee->getAssignee() === $this) {
                $requetesAssignee->setAssignee(null);
            }
        }

        return $this;
    }
}
