<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $prenom = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $role = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    private ?Entreprise $entreprise = null;

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
        $this->requetes = new ArrayCollection();
        $this->requetesAssignee = new ArrayCollection();
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
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
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

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): static
    {
        $this->role = $role;

        return $this;
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

    public function getEntreprise(): ?Entreprise
    {
        return $this->entreprise;
    }

    public function setEntreprise(?Entreprise $entreprise): static
    {
        $this->entreprise = $entreprise;

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
            // set the owning side to null (unless already changed)
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
            // set the owning side to null (unless already changed)
            if ($requetesAssignee->getAssignee() === $this) {
                $requetesAssignee->setAssignee(null);
            }
        }

        return $this;
    }
}
